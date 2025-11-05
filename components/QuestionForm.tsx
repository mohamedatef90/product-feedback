import React, { useState, useEffect } from 'react';
import { SurveyQuestion, QuestionType } from '../types';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';

interface QuestionFormProps {
  question?: SurveyQuestion | null;
  onSubmit: (questionData: Omit<SurveyQuestion, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const questionTypes: { value: QuestionType, label: string }[] = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'rating', label: 'Rating (1-5 Stars)' },
    { value: 'radio', label: 'Radio Buttons' },
];

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        label: '',
        description: '',
        type: 'text' as QuestionType,
        required: true,
        options: [{ value: 'option1', label: '' }],
        placeholder: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (question) {
            setFormData({
                label: question.label,
                description: question.description || '',
                type: question.type,
                required: question.required,
                options: question.options && question.options.length > 0 ? question.options : [{ value: 'option1', label: '' }],
                placeholder: question.placeholder || '',
            });
        } else {
            setFormData({
                label: '',
                description: '',
                type: 'text',
                required: true,
                options: [{ value: 'option1', label: '' }],
                placeholder: '',
            });
        }
    }, [question]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleOptionChange = (index: number, newLabel: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = { ...newOptions[index], label: newLabel, value: newLabel.toLowerCase().replace(/\s+/g, '-') || `option-${index}` };
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { value: `option${prev.options.length + 1}`, label: '' }]
        }));
    };

    const removeOption = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.label.trim()) {
            setError('Question label is required.');
            return;
        }
        if (formData.type === 'radio' && formData.options.some(opt => !opt.label.trim())) {
            setError('All radio options must have a label.');
            return;
        }
        setError('');
        
        const submissionData: any = {
            id: question?.id,
            label: formData.label,
            description: formData.description,
            type: formData.type,
            required: formData.required,
        };

        if (formData.type === 'radio') {
            submissionData.options = formData.options.filter(opt => opt.label.trim() !== '');
        }

        if (formData.type === 'text' || formData.type === 'textarea') {
            submissionData.placeholder = formData.placeholder;
        }

        onSubmit(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="label" className="block text-sm font-medium text-foreground mb-1.5">Question Label</label>
                <Input id="label" name="label" value={formData.label} onChange={handleChange} placeholder="e.g., How was your experience?" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">Description (Optional)</label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Add helper text for the user." rows={2} />
            </div>

            {(formData.type === 'text' || formData.type === 'textarea') && (
                <div>
                    <label htmlFor="placeholder" className="block text-sm font-medium text-foreground mb-1.5">Placeholder Text (Optional)</label>
                    <Input id="placeholder" name="placeholder" value={formData.placeholder} onChange={handleChange} placeholder="e.g., 'Enter your answer here...'" />
                </div>
            )}

            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1.5">Question Type</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                        {questionTypes.map(qt => (
                            <option key={qt.value} value={qt.value}>{qt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end pb-1.5">
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" name="required" checked={formData.required} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-muted-foreground rounded" />
                        <span className="text-sm font-medium text-foreground">Required</span>
                    </label>
                </div>
            </div>

            {formData.type === 'radio' && (
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Options</label>
                    <div className="space-y-2">
                        {formData.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input 
                                    value={option.label}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-grow"
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={formData.options.length <= 1}>
                                    <XIcon className="h-4 w-4" />
                                    <span className="sr-only">Remove option</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-3">Add Option</Button>
                </div>
            )}

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{question ? 'Save Changes' : 'Add Question'}</Button>
            </div>
        </form>
    );
};

export default QuestionForm;
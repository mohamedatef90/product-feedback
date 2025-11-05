import React, { useState } from 'react';
import { Project, SurveyData, SurveyQuestion } from '../types';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import RatingInput from './RatingInput';
import RadioGroup from './RadioGroup';

interface SurveyFormProps {
  project: Project;
  questions: SurveyQuestion[]; // New prop
  onSubmit: (response: SurveyData & { projectId: string }) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ project, questions, onSubmit }) => {
  const [formData, setFormData] = useState<SurveyData>({
    visitorName: '',
    visitorDepartment: '',
    answers: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleAnswerChange = (questionId: string, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      }
    }));
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };
  
  const handleVisitorInfoChange = (field: 'visitorName' | 'visitorDepartment', value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors.visitorInfo) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.visitorInfo;
            return newErrors;
        });
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.visitorName.trim() || !formData.visitorDepartment.trim()) {
      newErrors.visitorInfo = 'Please fill out your name and department.';
    }

    questions.forEach(q => {
      if (q.required && (formData.answers[q.id] === undefined || formData.answers[q.id] === null || formData.answers[q.id] === '' || formData.answers[q.id] === 0)) {
        newErrors[q.id] = 'This field is required.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        projectId: project.id,
      });
    }
  };

  const renderQuestion = (question: SurveyQuestion) => {
    const { id, label, type, description, options, required, placeholder } = question;
    const hasError = !!errors[id];
    
    const questionLabel = `${label}${required ? ' *' : ''}`;
    const baseClasses = `p-4 rounded-xl transition-all ${hasError ? 'bg-red-500/10 backdrop-blur-md ring-2 ring-destructive/30' : 'bg-white/20 backdrop-blur-md border border-white/20'}`;
    
    switch (type) {
        case 'rating':
            return (
                <div key={id} className={baseClasses}>
                    <h3 className="text-base font-semibold text-primary mb-1">{questionLabel}</h3>
                    {description && <p className="text-muted-foreground text-sm mb-3">{description}</p>}
                    <RatingInput 
                        rating={formData.answers[id] as number || 0} 
                        onRatingChange={(rating) => handleAnswerChange(id, rating)} 
                    />
                </div>
            );
        case 'text':
            return (
                <div key={id} className={baseClasses}>
                    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">{questionLabel}</label>
                    {description && <p className="text-muted-foreground text-sm mb-2">{description}</p>}
                    <Input id={id} name={id} value={formData.answers[id] as string || ''} onChange={(e) => handleAnswerChange(id, e.target.value)} placeholder={placeholder} />
                </div>
            );
        case 'textarea':
             return (
                <div key={id} className={baseClasses}>
                  <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">{questionLabel}</label>
                  {description && <p className="text-muted-foreground text-sm mb-2">{description}</p>}
                  <Textarea id={id} name={id} value={formData.answers[id] as string || ''} onChange={(e) => handleAnswerChange(id, e.target.value)} placeholder={placeholder} />
                </div>
            );
        case 'radio':
            return (
                <div key={id} className={baseClasses}>
                    <RadioGroup 
                        label={questionLabel}
                        description={description}
                        name={id}
                        options={options || []}
                        selectedValue={formData.answers[id] as string | null}
                        onChange={(value) => handleAnswerChange(id, value)}
                    />
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <div className="">
      <p className="text-muted-foreground mb-6">Your insights help us build better products. Thank you!</p>
      
      <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section: About You */}
          <div>
              <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">About You</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                      <label htmlFor="visitorName" className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                      <Input id="visitorName" name="visitorName" value={formData.visitorName} onChange={(e) => handleVisitorInfoChange('visitorName', e.target.value)} placeholder="e.g., Jane Doe" />
                  </div>
                  <div>
                      <label htmlFor="visitorDepartment" className="block text-sm font-medium text-foreground mb-1.5">Department *</label>
                      <Input id="visitorDepartment" name="visitorDepartment" value={formData.visitorDepartment} onChange={(e) => handleVisitorInfoChange('visitorDepartment', e.target.value)} placeholder="e.g., Engineering" />
                  </div>
              </div>
              {errors.visitorInfo && <p className="text-destructive text-sm mt-2">{errors.visitorInfo}</p>}
          </div>

          {/* Section: Dynamic Questions */}
          <div className="space-y-6">
               <h3 className="text-lg font-semibold text-primary tracking-tight border-b pb-2">Your Feedback</h3>
              <div className="pt-2 space-y-6">
                {questions.map(renderQuestion)}
              </div>
          </div>
          
          {Object.keys(errors).length > 0 && <p className="text-destructive text-sm text-center font-medium">Please fill out all required fields marked with *</p>}

          <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                  Submit Feedback
              </Button>
          </div>
      </form>
    </div>
  );
};

export default SurveyForm;
import React, { useState } from 'react';
import { SurveyQuestion } from '../types';
import Button from './Button';
import Modal from './Modal';
import QuestionForm from './QuestionForm';

interface FormBuilderProps {
  questions: SurveyQuestion[];
  onAddQuestion: (questionData: Omit<SurveyQuestion, 'id'>) => void;
  onUpdateQuestion: (question: SurveyQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const TypeBadge: React.FC<{ type: string }> = ({ type }) => (
    <span className="inline-block bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
        {type}
    </span>
);

const FormBuilder: React.FC<FormBuilderProps> = ({ questions, onAddQuestion, onUpdateQuestion, onDeleteQuestion }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | null>(null);
    const [questionToDelete, setQuestionToDelete] = useState<SurveyQuestion | null>(null);

    const handleOpenAddModal = () => {
        setEditingQuestion(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (question: SurveyQuestion) => {
        setEditingQuestion(question);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
    };

    const handleFormSubmit = (questionData: Omit<SurveyQuestion, 'id'> & { id?: string }) => {
        if (questionData.id) {
            onUpdateQuestion(questionData as SurveyQuestion);
        } else {
            const { id, ...newQuestionData } = questionData;
            onAddQuestion(newQuestionData);
        }
        handleCloseModal();
    };

    const handleConfirmDelete = () => {
        if (questionToDelete) {
            onDeleteQuestion(questionToDelete.id);
            setQuestionToDelete(null);
        }
    };
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={handleOpenAddModal}>
                    <PlusIcon className="h-4 w-4 mr-2"/>
                    Add Question
                </Button>
            </div>
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
                <div className="divide-y divide-white/30">
                    {questions.length > 0 ? questions.map(q => (
                        <div key={q.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex-grow">
                                <p className="font-medium text-primary">{q.label}</p>
                                {q.description && <p className="text-sm text-muted-foreground mt-1">{q.description}</p>}
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0 mt-2 sm:mt-0">
                                <TypeBadge type={q.type} />
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => handleOpenEditModal(q)}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => setQuestionToDelete(q)}>Delete</Button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No survey questions yet. Add one to get started! ✨</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingQuestion ? 'Edit Question' : 'Add New Question'}>
                <QuestionForm
                    question={editingQuestion}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
            
            <Modal isOpen={!!questionToDelete} onClose={() => setQuestionToDelete(null)} title="Confirm Question Deletion">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete the question: <strong className="text-foreground">"{questionToDelete?.label}"</strong>?
                    </p>
                    <p className="mt-2 text-sm text-destructive font-medium">This action cannot be undone and may affect existing survey data.</p>
                </div>
                <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="secondary" onClick={() => setQuestionToDelete(null)}>Cancel</Button>
                    <Button type="button" variant="destructive" onClick={handleConfirmDelete}>Delete Question</Button>
                </div>
            </Modal>
        </div>
    );
}

export default FormBuilder;
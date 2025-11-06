
import React, { useState, useMemo } from 'react';
import { Project, SurveyResponse, SurveyQuestion } from '../types';
import Button from './Button';
import Modal from './Modal';
import RatingInput from './RatingInput';

interface SurveyResultsProps {
    responses: SurveyResponse[];
    projects: Project[];
    questions: SurveyQuestion[];
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ responses, projects, questions }) => {
    const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

    // FIX: Replaced generic type argument on .reduce() with a type assertion on the initial value
    // to resolve "Untyped function calls may not accept type arguments" error.
    const responsesByProject = useMemo(() => {
        return responses.reduce((acc, response) => {
            const project = projects.find(p => p.id === response.project_id);
            if (!project) return acc;
            if (!acc[project.id]) {
                acc[project.id] = { projectInfo: project, responses: [] };
            }
            acc[project.id].responses.push(response);
            return acc;
        }, {} as Record<string, { projectInfo: Project; responses: SurveyResponse[] }>);
    }, [responses, projects]);

    const renderAnswer = (question: SurveyQuestion, answer: any) => {
        if (answer === null || answer === undefined) {
            return <p className="text-muted-foreground italic">Not answered</p>;
        }
        switch (question.type) {
            case 'rating':
                return <RatingInput rating={answer as number} readOnly />;
            case 'textarea':
                return <p className="text-foreground whitespace-pre-wrap">{answer}</p>;
            default:
                return <p className="text-foreground">{answer}</p>;
        }
    };

    return (
        <div className="space-y-8">
            {Object.keys(responsesByProject).length > 0 ? (
                Object.values(responsesByProject).map(({ projectInfo, responses }) => (
                    <div key={projectInfo.id} className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl overflow-hidden">
                        <div className="p-5 bg-black/5 border-b border-white/20">
                            <h3 className="text-xl font-semibold text-foreground">{projectInfo.name}</h3>
                            <p className="text-sm text-muted-foreground">{responses.length} submission(s)</p>
                        </div>
                        <div className="divide-y divide-white/20">
                            {responses.map(response => (
                                <div key={response.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex-grow">
                                        {/* FIX: Changed visitor_name to visitorName to match SurveyResponse type. */}
                                        <p className="font-semibold text-foreground">{response.visitorName}</p>
                                        {/* FIX: Changed visitor_department to visitorDepartment to match SurveyResponse type. */}
                                        <p className="text-sm text-muted-foreground">{response.visitorDepartment}</p>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto">
                                        <p className="text-sm text-muted-foreground flex-grow sm:flex-grow-0">
                                            {new Date(response.created_at).toLocaleString()}
                                        </p>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => setSelectedResponse(response)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl">
                    <p className="text-muted-foreground text-xl">No survey responses have been recorded yet. 📝</p>
                </div>
            )}

            <Modal isOpen={!!selectedResponse} onClose={() => setSelectedResponse(null)} title="Survey Submission Details">
                {selectedResponse && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Submission Info</h3>
                            <div className="text-sm space-y-1">
                                {/* FIX: Changed visitor_name to visitorName to match SurveyResponse type. */}
                                <p><strong className="text-muted-foreground">Name:</strong> {selectedResponse.visitorName}</p>
                                {/* FIX: Changed visitor_department to visitorDepartment to match SurveyResponse type. */}
                                <p><strong className="text-muted-foreground">Department:</strong> {selectedResponse.visitorDepartment}</p>
                                <p><strong className="text-muted-foreground">Date:</strong> {new Date(selectedResponse.created_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6">
                            <h3 className="text-lg font-semibold text-primary mb-4">Answers</h3>
                            <div className="space-y-5">
                                {questions.map(q => (
                                    <div key={q.id}>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">{q.label}</label>
                                        {q.description && <p className="text-xs text-muted-foreground mb-2">{q.description}</p>}
                                        {renderAnswer(q, selectedResponse.answers[q.id])}
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="flex justify-end pt-6">
                            <Button variant="secondary" onClick={() => setSelectedResponse(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SurveyResults;

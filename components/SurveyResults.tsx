
import React, { useState, useMemo } from 'react';
import { Project, SurveyResponse, SurveyQuestion } from '../types';
import Button from './Button';
import Modal from './Modal';
import RatingInput from './RatingInput';
import SurveyAnalytics from './SurveyAnalytics';

interface SurveyResultsProps {
    responses: SurveyResponse[];
    projects: Project[];
    questions: SurveyQuestion[];
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ responses, projects, questions }) => {
    const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
    const [view, setView] = useState<'list' | 'analytics'>('list');

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
        if (answer === null || answer === undefined || answer === '') {
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
        <div>
            <div className="flex justify-start mb-6">
                <div className="inline-flex rounded-lg shadow-sm bg-white/30 backdrop-blur-xl border border-white/20 p-1">
                    <Button
                        variant={view === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setView('list')}
                        className={`rounded-md !shadow-none backdrop-blur-none border-none ${view === 'list' ? 'bg-white/80' : ''}`}
                    >
                        Submissions List
                    </Button>
                    <Button
                        variant={view === 'analytics' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setView('analytics')}
                        className={`rounded-md !shadow-none backdrop-blur-none border-none ${view === 'analytics' ? 'bg-white/80' : ''}`}
                    >
                        Analytics
                    </Button>
                </div>
            </div>

            {view === 'list' && (
                <div className="space-y-8">
                    {Object.keys(responsesByProject).length > 0 ? (
                        Object.values(responsesByProject).map(({ projectInfo, responses }) => (
                            <div key={projectInfo.id} className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl overflow-hidden">
                                <div className="p-5 bg-black/5 border-b border-white/20">
                                    <h3 className="text-xl font-semibold text-foreground">{projectInfo.name}</h3>
                                    <p className="text-sm text-muted-foreground">{responses.length} submission(s)</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left rtl:text-right">
                                        <thead className="text-xs text-muted-foreground uppercase bg-black/5">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Visitor Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Department
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Submission Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {responses.map(response => (
                                                <tr key={response.id} className="border-b border-white/20 last:border-b-0 hover:bg-black/5 transition-colors">
                                                    <td scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                                                        {response.visitor_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {response.visitor_department}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {new Date(response.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => setSelectedResponse(response)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl">
                            <p className="text-muted-foreground text-xl">No survey responses have been recorded yet. 📝</p>
                        </div>
                    )}
                </div>
            )}

            {view === 'analytics' && (
                <SurveyAnalytics
                    responses={responses}
                    projects={projects}
                    questions={questions}
                />
            )}

            <Modal isOpen={!!selectedResponse} onClose={() => setSelectedResponse(null)} title={selectedResponse ? `Feedback from ${selectedResponse.visitor_name}` : 'Survey Submission Details'}>
                {selectedResponse && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-4">Submission Info</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div>
                                    <p className="font-medium text-muted-foreground">Name</p>
                                    <p className="text-foreground mt-0.5">{selectedResponse.visitor_name}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">Department</p>
                                    <p className="text-foreground mt-0.5">{selectedResponse.visitor_department}</p>
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <p className="font-medium text-muted-foreground">Date</p>
                                    <p className="text-foreground mt-0.5">{new Date(selectedResponse.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6">
                            <h3 className="text-lg font-semibold text-primary mb-4">Answers</h3>
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left">
                                        <tr>
                                            <th className="font-semibold text-foreground pb-2 border-b border-border w-1/3">Question</th>
                                            <th className="font-semibold text-foreground pb-2 border-b border-border">Answer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map(q => (
                                            <tr key={q.id} className="border-b border-border last:border-b-0">
                                                <td className="py-4 pr-4 align-top">
                                                    <p className="font-medium text-foreground">{q.label}</p>
                                                    {q.description && <p className="text-xs text-muted-foreground mt-1">{q.description}</p>}
                                                </td>
                                                <td className="py-4 align-top">
                                                    {renderAnswer(q, selectedResponse.answers[q.id])}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

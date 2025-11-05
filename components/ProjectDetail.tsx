import React, { useState } from 'react';
import { Project, SurveyData, SurveyQuestion } from '../types';
import Button from './Button';
import SurveyForm from './SurveyForm';
import Modal from './Modal';

interface ProjectDetailProps {
  project: Project;
  surveyQuestions: SurveyQuestion[];
  onSubmitSurvey: (response: SurveyData & { projectId: string }) => void;
  onBack: () => void;
}

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 9 10.5Z" />
    </svg>
);


const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, surveyQuestions, onSubmitSurvey, onBack }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={onBack} variant="secondary" className="mb-8">
        &larr; Back to Projects
      </Button>

      <div className="space-y-12">
        {/* Section 1: Project Info */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl p-6 md:p-8">
            <img src={project.image_url} alt={project.name} className="w-full h-64 md:h-80 object-cover rounded-2xl border" />
            <div className="pt-8">
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">{project.name}</h2>
                <div className="mt-4">
                    <p className="text-lg text-muted-foreground line-clamp-4">{project.description}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto self-start -ml-1 mt-1" onClick={() => setIsDescriptionModalOpen(true)}>
                        Read More...
                    </Button>
                </div>
                <div className="mt-8">
                     <a 
                        href={project.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                     >
                        <Button as="span" variant="outline">
                            View Application
                            <ExternalLinkIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
        
        {/* Section 2: Survey */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl p-6 md:p-8">
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-2">Submit Your Feedback</h3>
            <SurveyForm project={project} questions={surveyQuestions} onSubmit={onSubmitSurvey} />
        </div>
      </div>

       <Modal isOpen={isDescriptionModalOpen} onClose={() => setIsDescriptionModalOpen(false)} title={project.name}>
          <div>
            <p className="text-base text-muted-foreground whitespace-pre-wrap">{project.description}</p>
          </div>
          <div className="flex justify-end pt-6">
              <Button variant="secondary" onClick={() => setIsDescriptionModalOpen(false)}>Close</Button>
          </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
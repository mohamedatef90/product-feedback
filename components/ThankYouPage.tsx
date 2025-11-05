import React, { useState } from 'react';
import Button from './Button';
import { Project } from '../types';
import Modal from './Modal';

interface CheckCircleIconProps {
    className?: string;
}

const CheckCircleIcon: React.FC<CheckCircleIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 9 10.5Z" />
    </svg>
);


interface ThankYouPageProps {
  project: Project;
  onReturn: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ project, onReturn }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDescriptionModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
            <CheckCircleIcon className="w-20 h-20 text-system-green mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-foreground mb-3">Thank You!</h2>
            <p className="text-muted-foreground text-lg mb-8">Your feedback for <strong>{project.name}</strong> has been successfully submitted. We appreciate you taking the time to help us improve.</p>
            <Button onClick={onReturn} size="lg" variant="secondary">
                Back to All Projects
            </Button>
        </div>

        <div className="mt-12 pt-10">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">Revisit the Application</h3>
             <a 
                href={project.project_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-white/50 hover:-translate-y-1.5"
             >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img src={project.image_url} alt={project.name} className="w-full sm:w-48 h-28 object-cover rounded-xl border"/>
                    <div className="text-left flex-grow">
                        <p className="text-lg font-semibold text-foreground">{project.name}</p>
                        <p className="text-muted-foreground text-base mt-1 line-clamp-3">{project.description}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto self-start -ml-1 mt-1 mb-4" onClick={handleReadMoreClick}>
                            Read More...
                        </Button>
                        <div className="text-base text-system-blue font-semibold flex items-center">
                            Open Application
                            <ExternalLinkIcon className="ml-2 h-5 w-5" />
                        </div>
                    </div>
                </div>
            </a>
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

export default ThankYouPage;
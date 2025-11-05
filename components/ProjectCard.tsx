import React from 'react';
import { Project } from '../types';
import Button from './Button';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
  onReadMore: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onReadMore }) => {
  return (
    <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-white/50 hover:-translate-y-2 flex flex-col group">
      <img src={project.image_url} alt={project.name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-foreground mb-2">{project.name}</h2>
        <div className="flex-grow mb-4">
          <p className="text-muted-foreground text-base line-clamp-4">{project.description}</p>
        </div>
        <Button variant="link" size="sm" className="p-0 h-auto self-start mb-4 -ml-1" onClick={onReadMore}>
            Read More...
        </Button>
        <div className="mt-auto">
          <Button onClick={onSelect} className="w-full" variant="default" size="lg">
            Provide Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
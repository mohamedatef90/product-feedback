import React, { useState } from 'react';
import { Project, SurveyQuestion } from '../types';
import Button from './Button';
import Modal from './Modal';
import ProjectForm from './ProjectForm';
import FormBuilder from './FormBuilder';

interface AdminPageProps {
  projects: Project[];
  onAddProject: (projectData: Omit<Project, 'id' | 'created_at'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  surveyQuestions: SurveyQuestion[];
  onAddQuestion: (questionData: Omit<SurveyQuestion, 'id' | 'created_at'>) => void;
  onUpdateQuestion: (question: SurveyQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const AdminPage: React.FC<AdminPageProps> = ({ 
    projects, onAddProject, onUpdateProject, onDeleteProject,
    surveyQuestions, onAddQuestion, onUpdateQuestion, onDeleteQuestion 
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'survey'>('projects');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [viewingDescription, setViewingDescription] = useState<Project | null>(null);

  const handleOpenAddProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectFormSubmit = (projectData: Omit<Project, 'id' | 'created_at'> & { id?: string }) => {
    if (projectData.id) {
      onUpdateProject({ ...projectData, id: projectData.id, created_at: editingProject!.created_at });
    } else {
      const { id, ...newProjectData } = projectData;
      onAddProject(newProjectData);
    }
    handleCloseProjectModal();
  };

  const handleConfirmDeleteProject = () => {
    if (projectToDelete) {
        onDeleteProject(projectToDelete.id);
        setProjectToDelete(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-foreground tracking-tight">Admin Panel</h2>
        {activeTab === 'projects' && (
            <Button onClick={handleOpenAddProjectModal}>
                <PlusIcon className="h-5 w-5 mr-2"/>
                Add Project
            </Button>
        )}
      </div>

      <div className="mb-8 border-b border-border">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('projects')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 text-base transition-colors focus:outline-none ${activeTab === 'projects' ? 'border-system-blue text-system-blue font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            aria-current={activeTab === 'projects' ? 'page' : undefined}
          >
            Manage Projects
          </button>
          <button
            onClick={() => setActiveTab('survey')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 text-base transition-colors focus:outline-none ${activeTab === 'survey' ? 'border-system-blue text-system-blue font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            aria-current={activeTab === 'survey' ? 'page' : undefined}
          >
            Manage Survey Form
          </button>
        </nav>
      </div>

      {activeTab === 'projects' && (
        <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl">
          <div className="divide-y divide-white/20">
              {projects.length > 0 ? projects.map(project => (
                  <div key={project.id} className="p-5 flex flex-col md:flex-row items-center gap-5">
                      <img src={project.image_url} alt={project.name} className="w-36 h-24 object-cover rounded-lg flex-shrink-0 border" />
                      <div className="flex-grow text-center md:text-left">
                          <h3 className="font-semibold text-lg text-foreground">{project.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-4">{project.description}</p>
                          <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => setViewingDescription(project)}>
                              Read More...
                          </Button>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                          <Button variant="secondary" size="sm" onClick={() => handleOpenEditProjectModal(project)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => setProjectToDelete(project)}>Delete</Button>
                      </div>
                  </div>
              )) : (
                   <div className="p-12 text-center text-muted-foreground">
                      <p className="text-lg">No projects found. Add your first project to get started! 🚀</p>
                  </div>
              )}
          </div>
        </div>
      )}

      {activeTab === 'survey' && (
        <FormBuilder 
            questions={surveyQuestions}
            onAddQuestion={onAddQuestion}
            onUpdateQuestion={onUpdateQuestion}
            onDeleteQuestion={onDeleteQuestion}
        />
      )}
      
      <Modal isOpen={isProjectModalOpen} onClose={handleCloseProjectModal} title={editingProject ? 'Edit Project' : 'Add New Project'}>
        <ProjectForm
          project={editingProject}
          onSubmit={handleProjectFormSubmit}
          onCancel={handleCloseProjectModal}
        />
      </Modal>

      <Modal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} title="Confirm Project Deletion">
        <div>
            <p className="text-base text-muted-foreground">
                Are you sure you want to delete the project: <strong className="text-foreground">"{projectToDelete?.name}"</strong>?
            </p>
            <p className="mt-2 text-base text-system-red font-semibold">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="secondary" onClick={() => setProjectToDelete(null)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDeleteProject}>Delete Project</Button>
        </div>
      </Modal>

      <Modal isOpen={!!viewingDescription} onClose={() => setViewingDescription(null)} title={viewingDescription?.name || 'Project Description'}>
        <div>
            <p className="text-base text-muted-foreground whitespace-pre-wrap">{viewingDescription?.description}</p>
        </div>
        <div className="flex justify-end pt-6">
            <Button variant="secondary" onClick={() => setViewingDescription(null)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
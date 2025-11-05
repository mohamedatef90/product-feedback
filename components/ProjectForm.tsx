import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (projectData: Omit<Project, 'id' | 'created_at'> & { id?: string }) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    project_url: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        image_url: project.image_url,
        project_url: project.project_url,
      });
    } else {
      setFormData({ name: '', description: '', image_url: '', project_url: '' });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.image_url.trim() || !formData.project_url.trim()) {
      setError('All fields are required.');
      return;
    }
    setError('');

    onSubmit({
      id: project?.id,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Project Name</label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., QuantumLeap CRM" required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">Description</label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="A short description of the project." rows={3} required />
      </div>
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
        <Input id="image_url" name="image_url" type="url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.png" required />
      </div>
      <div>
        <label htmlFor="project_url" className="block text-sm font-medium text-foreground mb-1.5">Project URL</label>
        <Input id="project_url" name="project_url" type="url" value={formData.project_url} onChange={handleChange} placeholder="https://example.com/project" required />
      </div>

      {error && <p className="text-destructive text-sm font-medium">{error}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{project ? 'Save Changes' : 'Add Project'}</Button>
      </div>
    </form>
  );
};

export default ProjectForm;
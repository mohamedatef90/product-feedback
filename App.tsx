import React, { useState, useCallback, useEffect } from 'react';
import { Project, SurveyResponse, SurveyData, SurveyQuestion, ToastMessage } from './types';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import ThankYouPage from './components/ThankYouPage';
import Input from './components/Input';
import AdminPage from './components/AdminPage';
import ToastContainer from './components/Toast';
import LoginPage from './components/LoginPage';
import Modal from './components/Modal';
import Button from './components/Button';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { INITIAL_SURVEY_QUESTIONS } from './constants';


type View = 'gallery' | 'projectDetail' | 'thankyou' | 'admin';
type UserRole = 'admin' | 'guest' | null;

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

// A robust utility to extract a string message from an unknown error.
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred. See the console for more details.';
};


function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<View>('gallery');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDescription, setViewingDescription] = useState<Project | null>(null);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const fetchProjects = useCallback(async () => {
    try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setProjects(data as Project[]);
    } catch (error: unknown) {
        addToast(`Error fetching projects: ${getErrorMessage(error)}`, 'error');
        console.error('Error fetching projects:', error);
    }
  }, [addToast]);
  
  const fetchQuestions = useCallback(async () => {
    try {
        const { data, error } = await supabase.from('survey_questions').select('*').order('display_order', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
            setSurveyQuestions(data as SurveyQuestion[]);
        } else {
            setSurveyQuestions(INITIAL_SURVEY_QUESTIONS);
        }
    } catch (error: unknown) {
        addToast(`Error fetching survey questions: ${getErrorMessage(error)}`, 'error');
        console.error('Error fetching questions:', error);
        setSurveyQuestions(INITIAL_SURVEY_QUESTIONS); // Fallback on error too
    }
  }, [addToast]);
  
  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserRole('admin');
      } else {
        setUserRole('guest'); // Default to guest if no session
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
       setUserRole(session ? 'admin' : 'guest');
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userRole) { // Fetch data once a role is determined (guest or admin)
        Promise.all([fetchProjects(), fetchQuestions()]);
    }
  }, [userRole, fetchProjects, fetchQuestions]);

  const handleAdminLogin = () => setUserRole('admin');
  const handleGuestLogin = () => setUserRole('guest');
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    setCurrentView('gallery');
    setProjects([]); // Clear data on logout
    setSurveyQuestions([]);
  };

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setCurrentView('projectDetail');
  }, []);

  const handleSubmitSurvey = useCallback(async (response: SurveyData & { projectId: string }) => {
    const submissionData = {
        project_id: response.projectId,
        visitor_name: response.visitorName,
        visitor_department: response.visitorDepartment,
        answers: response.answers,
    };
    try {
        const { error } = await supabase.from('survey_responses').insert([submissionData]);
        if (error) throw error;
        setCurrentView('thankyou');
    } catch (error: unknown) {
        addToast(`Failed to submit feedback: ${getErrorMessage(error)}`, 'error');
        console.error('Error submitting survey:', error);
    }
  }, [addToast]);

  const handleReturnToGallery = useCallback(() => {
    setSelectedProject(null);
    setCurrentView('gallery');
    setSearchQuery('');
  }, []);

  const handleNavigate = useCallback((view: View) => {
    if (view === 'admin' && userRole !== 'admin') {
        return;
    }
    setCurrentView(view);
    setSelectedProject(null);
    setSearchQuery('');
  }, [userRole]);

  // Project CRUD Handlers
  const handleAddProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
    try {
        const { data, error } = await supabase.from('projects').insert([projectData]).select();
        if (error) throw error;
        
        if (data && data.length > 0) {
            setProjects(prev => [data[0], ...prev]);
            addToast(`Project "${data[0].name}" added successfully!`);
        } else {
            addToast('Project added successfully. Refreshing list...', 'success');
            await fetchProjects();
        }
    } catch (error: unknown) {
        addToast(`Error adding project: ${getErrorMessage(error)}`, 'error');
        console.error('Error adding project:', error);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
        const { id, created_at, ...updateData } = updatedProject;
        const { data, error } = await supabase.from('projects').update(updateData).eq('id', id).select();
        if (error) throw error;

        if (data && data.length > 0) {
            setProjects(prev => prev.map(p => p.id === id ? data[0] : p));
            addToast(`Project "${data[0].name}" updated successfully!`);
        } else {
            addToast('Project updated successfully. Refreshing list...', 'success');
            await fetchProjects();
        }
    } catch (error: unknown) {
        addToast(`Error updating project: ${getErrorMessage(error)}`, 'error');
        console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
        const projectName = projects.find(p => p.id === projectId)?.name;
        const { error } = await supabase.from('projects').delete().eq('id', projectId);
        if (error) throw error;

        setProjects(prev => prev.filter(p => p.id !== projectId));
        if (projectName) {
            addToast(`Project "${projectName}" has been deleted.`);
        } else {
            addToast('Project deleted successfully.');
        }
    } catch (error: unknown) {
        addToast(`Error deleting project: ${getErrorMessage(error)}`, 'error');
        console.error('Error deleting project:', error);
    }
  };
  
  // Survey Question CRUD Handlers
  const handleAddQuestion = async (questionData: Omit<SurveyQuestion, 'id' | 'created_at'>) => {
    try {
        const { data, error } = await supabase.from('survey_questions').insert([questionData]).select();
        if (error) throw error;
        
        if (data && data.length > 0) {
            await fetchQuestions(); // Refetch to respect display_order
            addToast('New question added to the survey.');
        } else {
            addToast('Question added successfully. Refreshing list...', 'success');
            await fetchQuestions();
        }
    } catch (error: unknown) {
        addToast(`Error adding question: ${getErrorMessage(error)}`, 'error');
        console.error('Error adding question:', error);
    }
  };

  const handleUpdateQuestion = async (updatedQuestion: SurveyQuestion) => {
    try {
        const { id, created_at, ...questionData } = updatedQuestion;
        const { error } = await supabase.from('survey_questions').update(questionData).eq('id', id);
        if (error) throw error;

        await fetchQuestions(); // Refetch to respect display_order
        addToast('Question updated successfully.');
    } catch (error: unknown) {
        addToast(`Error updating question: ${getErrorMessage(error)}`, 'error');
        console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
        const questionLabel = surveyQuestions.find(q => q.id === questionId)?.label;
        const { error } = await supabase.from('survey_questions').delete().eq('id', questionId);
        if (error) throw error;
        
        setSurveyQuestions(prev => prev.filter(q => q.id !== questionId));
        if (questionLabel) {
            addToast(`Question "${questionLabel}" was deleted.`);
        } else {
            addToast('Question deleted successfully.');
        }
    } catch (error: unknown) {
      addToast(`Error deleting question: ${getErrorMessage(error)}`, 'error');
      console.error('Error deleting question:', error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'projectDetail':
        return selectedProject && <ProjectDetail project={selectedProject} surveyQuestions={surveyQuestions} onSubmitSurvey={handleSubmitSurvey} onBack={handleReturnToGallery} />;
      case 'thankyou':
        return selectedProject && <ThankYouPage project={selectedProject} onReturn={handleReturnToGallery} />;
      case 'admin':
         if (userRole !== 'admin') {
          handleNavigate('gallery');
          return null;
        }
        return <AdminPage 
                    projects={projects}
                    onAddProject={handleAddProject}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject}
                    surveyQuestions={surveyQuestions}
                    onAddQuestion={handleAddQuestion}
                    onUpdateQuestion={handleUpdateQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                />;
      case 'gallery':
      default:
        const filteredProjects = projects.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
            <div>
                 <div className="mb-12 max-w-xl mx-auto">
                    <label htmlFor="search-projects" className="sr-only">Search Projects</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-primary" />
                        </div>
                        <Input
                            id="search-projects"
                            type="text"
                            placeholder="Filter projects by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 h-12 rounded-xl text-lg"
                        />
                    </div>
                </div>
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map(project => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          onSelect={() => handleSelectProject(project)} 
                          onReadMore={() => setViewingDescription(project)}
                        />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-xl">No projects found. 😔</p>
                    </div>
                )}
            </div>
        );
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
             <p className="text-xl text-foreground">Loading...</p>
        </div>
    );
  }

  if (!userRole) {
    return <LoginPage onAdminLogin={handleAdminLogin} onGuestLogin={handleGuestLogin} />;
  }

  return (
    <div className="min-h-screen text-foreground">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <Header onNavigate={handleNavigate} userRole={userRole} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 md:py-16">
        {renderContent()}
      </main>
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
}

export default App;
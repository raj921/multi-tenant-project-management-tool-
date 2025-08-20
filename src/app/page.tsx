'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import AnimatedContainer from '@/components/animated-container';
import AnimatedCard from '@/components/animated-card';
import AnimatedButton from '@/components/animated-button';
import AnimatedProgress from '@/components/animated-progress';
import AnimatedBadge from '@/components/animated-badge';
import { 
  Building2, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Target,
  MoreHorizontal,
  Edit
} from 'lucide-react';

// Mock data for demonstration
const mockOrganizations = [
  { id: '1', name: 'Acme Corp', slug: 'acme-corp', contactEmail: 'contact@acme.com', createdAt: '2024-01-01' },
  { id: '2', name: 'Tech Startup', slug: 'tech-startup', contactEmail: 'hello@tech.com', createdAt: '2024-01-15' },
];

const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website',
    status: 'ACTIVE' as const,
    dueDate: '2024-12-31',
    createdAt: '2024-01-01',
    taskCount: 10,
    completedTasksCount: 7,
    completionRate: 70,
    organization: { id: '1', name: 'Acme Corp', slug: 'acme-corp' },
    createdBy: { id: '1', username: 'john_doe' },
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop a new mobile application for iOS and Android',
    status: 'IN_PROGRESS' as const,
    dueDate: '2024-11-30',
    createdAt: '2024-01-15',
    taskCount: 15,
    completedTasksCount: 5,
    completionRate: 33,
    organization: { id: '1', name: 'Acme Corp', slug: 'acme-corp' },
    createdBy: { id: '1', username: 'jane_smith' },
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for product launch',
    status: 'ON_HOLD' as const,
    dueDate: '2024-12-15',
    createdAt: '2024-02-01',
    taskCount: 8,
    completedTasksCount: 2,
    completionRate: 25,
    organization: { id: '2', name: 'Tech Startup', slug: 'tech-startup' },
    createdBy: { id: '2', username: 'bob_wilson' },
  },
];

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  dueDate?: string;
  createdAt: string;
  taskCount: number;
  completedTasksCount: number;
  completionRate: number;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  createdBy: {
    id: string;
    username: string;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
}

export default function Home() {
  const { toast } = useToast();
  
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('ACTIVE');
  const [newProjectDueDate, setNewProjectDueDate] = useState('');
  const [newProjectTaskCount, setNewProjectTaskCount] = useState('');
  const [newProjectCompletedTasks, setNewProjectCompletedTasks] = useState('');
  
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(false);

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim() || !newOrgEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newOrg: Organization = {
        id: Date.now().toString(),
        name: newOrgName,
        slug: newOrgName.toLowerCase().replace(' ', '-'),
        contactEmail: newOrgEmail,
        createdAt: new Date().toISOString().split('T')[0],
        owner: {
          id: '1',
          username: 'current_user',
          email: 'user@example.com',
        },
      };
      
      setOrganizations([...organizations, newOrg]);
      setCurrentOrganization(newOrg);
      setIsCreateOrgOpen(false);
      setNewOrgName('');
      setNewOrgEmail('');
      setLoading(false);
      
      toast({
        title: "Organization created",
        description: `${newOrg.name} has been created successfully.`,
      });
    }, 1000);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Validation Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentOrganization) {
      toast({
        title: "Validation Error",
        description: "Please select an organization for the project.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const taskCount = parseInt(newProjectTaskCount) || 0;
    const completedTasksCount = parseInt(newProjectCompletedTasks) || 0;
    
    const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        description: newProjectDescription,
        status: newProjectStatus as any,
        dueDate: newProjectDueDate || undefined,
        createdAt: new Date().toISOString().split('T')[0],
        taskCount: taskCount,
        completedTasksCount: Math.min(completedTasksCount, taskCount),
        completionRate: taskCount > 0 ? Math.round((Math.min(completedTasksCount, taskCount) / taskCount) * 100) : 0,
        organization: currentOrganization,
        createdBy: {
          id: '1',
          username: 'current_user',
        },
      };
      
      setProjects([...projects, newProject]);
      setIsCreateProjectOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectStatus('ACTIVE');
      setNewProjectDueDate('');
      setNewProjectTaskCount('');
      setNewProjectCompletedTasks('');
      setLoading(false);
      
      toast({
        title: "Project created",
        description: `${newProject.name} has been created successfully.`,
      });
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Target className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'ON_HOLD': return <Clock className="w-4 h-4" />;
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const filteredProjects = currentOrganization 
    ? projects.filter(p => p.organization.id === currentOrganization.id)
    : projects;

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>
      
      <main id="main-content" className="p-4 md:p-8" role="main">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
            <p className="text-muted-foreground">
              {currentOrganization 
                ? `Managing projects for ${currentOrganization.name}`
                : 'Manage your projects across organizations'
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2" role="group" aria-label="Create actions">
            <Dialog open={isCreateOrgOpen} onOpenChange={setIsCreateOrgOpen}>
              <DialogTrigger asChild>
                <AnimatedButton variant="outline" delay={0.1} aria-label="Create new organization">
                  <Building2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  New Organization
                </AnimatedButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Organization</DialogTitle>
                  <DialogDescription>
                    Create a new organization to manage your projects.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-email">Contact Email</Label>
                    <Input
                      id="org-email"
                      type="email"
                      value={newOrgEmail}
                      onChange={(e) => setNewOrgEmail(e.target.value)}
                      placeholder="Enter contact email"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateOrgOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateOrganization} 
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Organization'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <AnimatedButton delay={0.2} aria-label="Create new project">
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  New Project
                </AnimatedButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Create a new project within your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-status">Status</Label>
                    <Select value={newProjectStatus} onValueChange={setNewProjectStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project-due-date">Due Date</Label>
                    <Input
                      id="project-due-date"
                      type="date"
                      value={newProjectDueDate}
                      onChange={(e) => setNewProjectDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-task-count">Total Tasks</Label>
                    <Input
                      id="project-task-count"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={newProjectTaskCount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d+$/.test(value)) {
                          setNewProjectTaskCount(value);
                        }
                      }}
                      placeholder="Enter total number of tasks"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-completed-tasks">Completed Tasks</Label>
                    <Input
                      id="project-completed-tasks"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={newProjectCompletedTasks}
                      onChange={(e) => {
                        const value = e.target.value;
                        const maxTasks = parseInt(newProjectTaskCount) || 0;
                        if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= maxTasks)) {
                          setNewProjectCompletedTasks(value);
                        }
                      }}
                      placeholder="Enter number of completed tasks"
                    />
                    {newProjectTaskCount && parseInt(newProjectTaskCount) > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>
                            {Math.round((parseInt(newProjectCompletedTasks) || 0) / parseInt(newProjectTaskCount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.round((parseInt(newProjectCompletedTasks) || 0) / parseInt(newProjectTaskCount) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="project-organization">Organization</Label>
                    <Select 
                      value={currentOrganization?.id || ''} 
                      onValueChange={(value) => {
                        const org = organizations.find(o => o.id === value);
                        setCurrentOrganization(org || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateProject} 
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Project'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Organization Selector */}
        <nav className="flex flex-wrap gap-2" role="navigation" aria-label="Organization filter">
          <Button
            variant={!currentOrganization ? "default" : "outline"}
            onClick={() => setCurrentOrganization(null)}
            aria-pressed={!currentOrganization}
            aria-label="Show all organizations"
          >
            All Organizations
          </Button>
          {organizations.map((org) => (
            <Button
              key={org.id}
              variant={currentOrganization?.id === org.id ? "default" : "outline"}
              onClick={() => setCurrentOrganization(org)}
              aria-pressed={currentOrganization?.id === org.id}
              aria-label={`Filter by ${org.name}`}
            >
              {org.name}
            </Button>
          ))}
        </nav>

        {/* Projects Grid */}
        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="sr-only">Projects</h2>
        <AnimatedContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {currentOrganization 
                  ? `No projects in ${currentOrganization.name}. Create your first project to get started.`
                  : 'Create an organization and your first project to get started.'
                }
              </p>
              <AnimatedButton onClick={() => setIsCreateProjectOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </AnimatedButton>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <AnimatedCard key={project.id} delay={index * 0.1}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {project.organization.name}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(project.completionRate)}%</span>
                    </div>
                    <AnimatedProgress value={project.completionRate} delay={0.2} showLabel={false} />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.completedTasksCount} of {project.taskCount} tasks</span>
                      <span>{project.taskCount} total</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <AnimatedBadge 
                      variant="secondary" 
                      className={`${getStatusColor(project.status)} flex items-center gap-1`}
                      delay={0.3}
                    >
                      {getStatusIcon(project.status)}
                      {project.status.replace('_', ' ')}
                    </AnimatedBadge>
                    
                    {project.dueDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(project.dueDate)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {project.createdBy.username}
                    </div>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))
          )}
        </AnimatedContainer>
        </section>
      </div>
    </main>
    </>
  );
}
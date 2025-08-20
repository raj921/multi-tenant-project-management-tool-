'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/contexts/OrganizationContext';
import TaskBoard from '@/components/task-board';
import { 
  Plus, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Send,
  Calendar,
  User,
  Edit,
  MoreHorizontal,
  Trash2,
  Flag,
  Search,
  Filter
} from 'lucide-react';

// Mock data for demonstration
const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website',
    status: 'ACTIVE',
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
    status: 'IN_PROGRESS',
    dueDate: '2024-11-30',
    createdAt: '2024-01-15',
    taskCount: 15,
    completedTasksCount: 5,
    completionRate: 33,
    organization: { id: '1', name: 'Acme Corp', slug: 'acme-corp' },
    createdBy: { id: '1', username: 'jane_smith' },
  },
];

const mockTasks = [
  {
    id: '1',
    title: 'Design homepage layout',
    description: 'Create wireframes and mockups for the homepage redesign',
    status: 'DONE' as const,
    priority: 'HIGH' as const,
    assigneeEmail: 'john@example.com',
    dueDate: '2024-12-15',
    createdAt: '2024-01-01',
    project: { id: '1', name: 'Website Redesign' },
    createdBy: { id: '1', username: 'john_doe' },
    commentCount: 2,
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up login, registration, and password reset functionality',
    status: 'IN_PROGRESS' as const,
    priority: 'URGENT' as const,
    assigneeEmail: 'jane@example.com',
    dueDate: '2024-12-10',
    createdAt: '2024-01-02',
    project: { id: '1', name: 'Website Redesign' },
    createdBy: { id: '2', username: 'jane_smith' },
    commentCount: 1,
  },
  {
    id: '3',
    title: 'Setup database schema',
    description: 'Design and implement the database structure for the mobile app',
    status: 'TODO' as const,
    priority: 'MEDIUM' as const,
    assigneeEmail: 'bob@example.com',
    dueDate: '2024-12-20',
    createdAt: '2024-01-03',
    project: { id: '2', name: 'Mobile App Development' },
    createdBy: { id: '3', username: 'bob_wilson' },
    commentCount: 0,
  },
  {
    id: '4',
    title: 'Create API endpoints',
    description: 'Develop RESTful API endpoints for mobile app functionality',
    status: 'TODO' as const,
    priority: 'HIGH' as const,
    assigneeEmail: 'alice@example.com',
    dueDate: '2024-12-18',
    createdAt: '2024-01-04',
    project: { id: '2', name: 'Mobile App Development' },
    createdBy: { id: '4', username: 'alice_jones' },
    commentCount: 0,
  },
];

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeEmail?: string;
  dueDate?: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    username: string;
  };
  commentCount?: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
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

export default function TasksPage() {
  const { state: orgState } = useOrganization();
  const { toast } = useToast();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesProject = !selectedProject || task.project.id === selectedProject.id;
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesProject && matchesSearch && matchesStatus && matchesPriority;
  });

  const handleTaskUpdate = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus as any }
        : task
    ));
  };

  const handleTaskCreate = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'TODO',
      priority: taskData.priority || 'MEDIUM',
      assigneeEmail: taskData.assigneeEmail,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      project: taskData.project || { id: '1', name: 'Default Project' },
      createdBy: { id: '1', username: 'current_user' },
      commentCount: 0,
    };
    
    setTasks([...tasks, newTask]);
  };

  const handleTaskEdit = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Task has been deleted successfully.",
    });
  };

  const handleAddComment = (taskId: string, content: string) => {
    // In a real app, this would call an API
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, commentCount: (task.commentCount || 0) + 1 }
        : task
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO': return <Target className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'DONE': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
            <p className="text-muted-foreground">
              {selectedProject 
                ? `Managing tasks for ${selectedProject.name}`
                : 'Select a project to manage its tasks'
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedProject?.id || ''} onValueChange={(value) => {
              const project = projects.find((p: Project) => p.id === value);
              setSelectedProject(project || null);
            }}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: Project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'board' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('board')}
              >
                Board
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Board */}
        {viewMode === 'board' ? (
          <TaskBoard
            tasks={filteredTasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onAddComment={handleAddComment}
          />
        ) : (
          /* List View */
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {filteredTasks.length} tasks found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge variant="outline" className={getStatusColor(task.status)}>
                              {getStatusIcon(task.status)}
                              <span className="ml-1 text-xs">
                                {task.status.replace('_', ' ')}
                              </span>
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              <Flag className="w-3 h-3 mr-1" />
                              {task.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Project: {task.project.name}</span>
                            {task.assigneeEmail && (
                              <span>Assignee: {task.assigneeEmail}</span>
                            )}
                            {task.dueDate && (
                              <span>Due: {formatDate(task.dueDate)}</span>
                            )}
                            {task.commentCount !== undefined && task.commentCount > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {task.commentCount} comments
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTaskEdit(task)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTaskDelete(task.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No tasks found matching your filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
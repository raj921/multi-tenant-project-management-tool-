'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
  GripVertical
} from 'lucide-react';

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

interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  timestamp: string;
  createdBy: {
    id: string;
    username: string;
  };
}

interface SortableTaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewComments: (task: Task) => void;
}

function SortableTaskItem({ task, onEdit, onDelete, onViewComments }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 cursor-move hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-0.5 flex-shrink-0"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold leading-tight truncate mb-1">
                {task.title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {task.project.name}
              </CardDescription>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              <Flag className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {getStatusIcon(task.status)}
                <span className="ml-1 text-xs">
                  {task.status.replace('_', ' ')}
                </span>
              </Badge>
              
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {task.commentCount !== undefined && task.commentCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewComments(task)}
                  className="h-7 w-7 p-0 hover:bg-muted"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs ml-1">{task.commentCount}</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-7 w-7 p-0 hover:bg-muted"
              >
                <Edit className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {task.assigneeEmail && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{task.assigneeEmail}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onViewComments: (task: Task) => void;
  onCreateTask: () => void;
}

function TaskColumn({ 
  title, 
  status, 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onViewComments,
  onCreateTask 
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'border-gray-200';
      case 'IN_PROGRESS': return 'border-blue-200';
      case 'DONE': return 'border-green-200';
      case 'CANCELLED': return 'border-red-200';
      default: return 'border-gray-200';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-50';
      case 'IN_PROGRESS': return 'bg-blue-50';
      case 'DONE': return 'bg-green-50';
      case 'CANCELLED': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div ref={setNodeRef} className={`flex-1 min-w-80 rounded-lg border ${getStatusColor(status)} ${getStatusBgColor(status)}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1 h-96 p-4">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onViewComments={onViewComments}
            />
          ))}
        </SortableContext>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateTask}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, newStatus: string) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

export default function TaskBoard({ 
  tasks, 
  onTaskUpdate, 
  onTaskCreate, 
  onTaskEdit, 
  onTaskDelete, 
  onAddComment 
}: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = {
    TODO: tasks.filter(task => task.status === 'TODO'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    DONE: tasks.filter(task => task.status === 'DONE'),
    CANCELLED: tasks.filter(task => task.status === 'CANCELLED'),
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Check if we're moving to a different column (status)
    const columnStatuses = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
    if (columnStatuses.includes(over.id as string)) {
      const newStatus = over.id as string;
      if (activeTask.status !== newStatus) {
        onTaskUpdate(active.id as string, newStatus);
        toast({
          title: "Task moved",
          description: `Task moved to ${newStatus.replace('_', ' ')}`,
        });
      }
    } 
    // Check if we're reordering within the same column
    else if (active.id !== over.id) {
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask && activeTask.status === overTask.status) {
        // Reorder within the same column
        const tasksInColumn = tasks.filter(t => t.status === activeTask.status);
        const oldIndex = tasksInColumn.findIndex(t => t.id === active.id);
        const newIndex = tasksInColumn.findIndex(t => t.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          // For now, we'll just show a toast since the parent component doesn't handle reordering
          // In a real implementation, you'd want to update the task order in the backend
          toast({
            title: "Task reordered",
            description: `Task moved to position ${newIndex + 1}`,
          });
        }
      }
    }

    setActiveId(null);
  }

  const handleViewComments = (task: Task) => {
    setSelectedTask(task);
    setIsCommentsOpen(true);
    // Mock comments - in real app, this would come from API
    setComments([
      {
        id: '1',
        content: 'This task is progressing well.',
        authorEmail: 'john@example.com',
        timestamp: new Date().toISOString(),
        createdBy: { id: '1', username: 'john_doe' }
      }
    ]);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) {
      return;
    }

    onAddComment(selectedTask.id, newComment);
    const newCommentObj: TaskComment = {
      id: Date.now().toString(),
      content: newComment,
      authorEmail: 'user@example.com',
      timestamp: new Date().toISOString(),
      createdBy: { id: '1', username: 'current_user' }
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required.",
        variant: "destructive",
      });
      return;
    }

    onTaskCreate({
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'TODO',
      priority: newTaskPriority as any,
      assigneeEmail: newTaskAssignee || undefined,
      dueDate: newTaskDueDate || undefined,
      project: tasks[0]?.project || { id: '1', name: 'Default Project' },
      createdAt: new Date().toISOString(),
      createdBy: { id: '1', username: 'current_user' },
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('MEDIUM');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Task created",
      description: "Task has been created successfully.",
    });
  };

  const handleEditTask = () => {
    if (!editingTask || !newTaskTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required.",
        variant: "destructive",
      });
      return;
    }

    onTaskEdit({
      ...editingTask,
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority as any,
      assigneeEmail: newTaskAssignee || undefined,
      dueDate: newTaskDueDate || undefined,
    });

    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('MEDIUM');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setIsEditDialogOpen(false);
    
    toast({
      title: "Task updated",
      description: "Task has been updated successfully.",
    });
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setNewTaskPriority(task.priority);
    setNewTaskAssignee(task.assigneeEmail || '');
    setNewTaskDueDate(task.dueDate || '');
    setIsEditDialogOpen(true);
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Task Board</h2>
          <p className="text-muted-foreground">
            Drag and drop tasks to update their status
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Create a new task and add it to the board
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-assignee">Assignee Email</Label>
                <Input
                  id="task-assignee"
                  type="email"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  placeholder="Enter assignee email"
                />
              </div>
              <div>
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <TaskColumn
            title="To Do"
            status="TODO"
            tasks={tasksByStatus.TODO}
            onEditTask={openEditDialog}
            onDeleteTask={onTaskDelete}
            onViewComments={handleViewComments}
            onCreateTask={() => setIsCreateDialogOpen(true)}
          />
          <TaskColumn
            title="In Progress"
            status="IN_PROGRESS"
            tasks={tasksByStatus.IN_PROGRESS}
            onEditTask={openEditDialog}
            onDeleteTask={onTaskDelete}
            onViewComments={handleViewComments}
            onCreateTask={() => setIsCreateDialogOpen(true)}
          />
          <TaskColumn
            title="Done"
            status="DONE"
            tasks={tasksByStatus.DONE}
            onEditTask={openEditDialog}
            onDeleteTask={onTaskDelete}
            onViewComments={handleViewComments}
            onCreateTask={() => setIsCreateDialogOpen(true)}
          />
          <TaskColumn
            title="Cancelled"
            status="CANCELLED"
            tasks={tasksByStatus.CANCELLED}
            onEditTask={openEditDialog}
            onDeleteTask={onTaskDelete}
            onViewComments={handleViewComments}
            onCreateTask={() => setIsCreateDialogOpen(true)}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card className="shadow-lg opacity-90">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{activeTask.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {activeTask.description}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Task Title</Label>
              <Input
                id="edit-task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <Label htmlFor="edit-task-description">Description</Label>
              <Textarea
                id="edit-task-description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            <div>
              <Label htmlFor="edit-task-priority">Priority</Label>
              <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-task-assignee">Assignee Email</Label>
              <Input
                id="edit-task-assignee"
                type="email"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="Enter assignee email"
              />
            </div>
            <div>
              <Label htmlFor="edit-task-due-date">Due Date</Label>
              <Input
                id="edit-task-due-date"
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTask}>
                Update Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Comments - {selectedTask?.title}</DialogTitle>
            <DialogDescription>
              View and add comments to this task
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Comments List */}
            <ScrollArea className="h-64 w-full border rounded-md p-4">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {comment.authorEmail.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {comment.createdBy.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Add Comment */}
            <div className="space-y-2">
              <Label htmlFor="new-comment">Add Comment</Label>
              <div className="flex gap-2">
                <Textarea
                  id="new-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your comment here..."
                  className="flex-1"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
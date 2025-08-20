export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  members: Array<{
    id: string;
    username: string;
    email: string;
  }>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  createdBy: {
    id: string;
    username: string;
    email: string;
  };
  taskCount: number;
  completedTasksCount: number;
  completionRate: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    organization: {
      id: string;
      name: string;
    };
  };
  createdBy: {
    id: string;
    username: string;
    email: string;
  };
}

export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  timestamp: string;
  task: {
    id: string;
    title: string;
  };
  createdBy: {
    id: string;
    username: string;
    email: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateJoined: string;
}

export interface OrganizationInput {
  name: string;
  slug?: string;
  contactEmail: string;
}

export interface ProjectInput {
  name: string;
  description?: string;
  status?: string;
  dueDate?: string;
  organizationId: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeEmail?: string;
  dueDate?: string;
  projectId: string;
}

export interface TaskCommentInput {
  content: string;
  authorEmail: string;
  taskId: string;
}
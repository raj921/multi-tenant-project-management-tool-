// Mock database service for development when PostgreSQL is not available
// This provides the same interface as the real Prisma client but uses in-memory data

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'bob@example.com',
    name: 'Bob Wilson',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockOrganizations = [
  {
    id: '1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    contactEmail: 'contact@acme.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: '1',
  },
  {
    id: '2',
    name: 'Tech Startup',
    slug: 'tech-startup',
    contactEmail: 'hello@tech.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: '2',
  },
];

const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website',
    status: 'ACTIVE',
    dueDate: new Date('2024-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
    taskCount: 10,
    completedTasksCount: 7,
    completionRate: 70,
    organizationId: '1',
    createdBy: '1',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop a new mobile application for iOS and Android',
    status: 'ACTIVE',
    dueDate: new Date('2024-11-30'),
    createdAt: new Date(),
    updatedAt: new Date(),
    taskCount: 15,
    completedTasksCount: 5,
    completionRate: 33,
    organizationId: '1',
    createdBy: '2',
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for product launch',
    status: 'ON_HOLD',
    dueDate: new Date('2024-12-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
    taskCount: 8,
    completedTasksCount: 2,
    completionRate: 25,
    organizationId: '2',
    createdBy: '3',
  },
];

const mockTasks = [
  {
    id: '1',
    title: 'Design homepage layout',
    description: 'Create wireframes and mockups for the homepage redesign',
    status: 'DONE',
    priority: 'HIGH',
    assigneeEmail: 'john@example.com',
    dueDate: new Date('2024-12-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: '1',
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up login, registration, and password reset functionality',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    assigneeEmail: 'jane@example.com',
    dueDate: new Date('2024-12-10'),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: '1',
    createdBy: '2',
  },
  {
    id: '3',
    title: 'Setup database schema',
    description: 'Design and implement the database structure for the mobile app',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeEmail: 'bob@example.com',
    dueDate: new Date('2024-12-20'),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: '2',
    createdBy: '3',
  },
  {
    id: '4',
    title: 'Create API endpoints',
    description: 'Develop RESTful API endpoints for mobile app functionality',
    status: 'TODO',
    priority: 'HIGH',
    assigneeEmail: 'alice@example.com',
    dueDate: new Date('2024-12-18'),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: '2',
    createdBy: '1',
  },
];

const mockTaskComments = [
  {
    id: '1',
    content: 'This task is progressing well. The wireframes look great!',
    timestamp: new Date(),
    taskId: '1',
    authorId: '1',
  },
  {
    id: '2',
    content: 'I\'ve reviewed the designs and they meet our requirements.',
    timestamp: new Date(),
    taskId: '1',
    authorId: '2',
  },
];

// Mock database client
export const mockDb = {
  user: {
    count: () => Promise.resolve(mockUsers.length),
    findMany: () => Promise.resolve(mockUsers),
    findUnique: (args: any) => {
      const user = mockUsers.find(u => u.id === args.where.id);
      return Promise.resolve(user || null);
    },
    create: (args: any) => {
      const newUser = { ...args.data, id: Date.now().toString() };
      mockUsers.push(newUser);
      return Promise.resolve(newUser);
    },
    update: (args: any) => {
      const index = mockUsers.findIndex(u => u.id === args.where.id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...args.data };
        return Promise.resolve(mockUsers[index]);
      }
      return Promise.resolve(null);
    },
    delete: (args: any) => {
      const index = mockUsers.findIndex(u => u.id === args.where.id);
      if (index !== -1) {
        const deleted = mockUsers.splice(index, 1)[0];
        return Promise.resolve(deleted);
      }
      return Promise.resolve(null);
    },
  },
  organization: {
    count: () => Promise.resolve(mockOrganizations.length),
    findMany: () => Promise.resolve(mockOrganizations),
    findUnique: (args: any) => {
      const org = mockOrganizations.find(o => o.id === args.where.id);
      return Promise.resolve(org || null);
    },
    create: (args: any) => {
      const newOrg = { ...args.data, id: Date.now().toString() };
      mockOrganizations.push(newOrg);
      return Promise.resolve(newOrg);
    },
    update: (args: any) => {
      const index = mockOrganizations.findIndex(o => o.id === args.where.id);
      if (index !== -1) {
        mockOrganizations[index] = { ...mockOrganizations[index], ...args.data };
        return Promise.resolve(mockOrganizations[index]);
      }
      return Promise.resolve(null);
    },
    delete: (args: any) => {
      const index = mockOrganizations.findIndex(o => o.id === args.where.id);
      if (index !== -1) {
        const deleted = mockOrganizations.splice(index, 1)[0];
        return Promise.resolve(deleted);
      }
      return Promise.resolve(null);
    },
  },
  project: {
    count: () => Promise.resolve(mockProjects.length),
    findMany: () => Promise.resolve(mockProjects),
    findUnique: (args: any) => {
      const project = mockProjects.find(p => p.id === args.where.id);
      return Promise.resolve(project || null);
    },
    create: (args: any) => {
      const newProject = { ...args.data, id: Date.now().toString() };
      mockProjects.push(newProject);
      return Promise.resolve(newProject);
    },
    update: (args: any) => {
      const index = mockProjects.findIndex(p => p.id === args.where.id);
      if (index !== -1) {
        mockProjects[index] = { ...mockProjects[index], ...args.data };
        return Promise.resolve(mockProjects[index]);
      }
      return Promise.resolve(null);
    },
    delete: (args: any) => {
      const index = mockProjects.findIndex(p => p.id === args.where.id);
      if (index !== -1) {
        const deleted = mockProjects.splice(index, 1)[0];
        return Promise.resolve(deleted);
      }
      return Promise.resolve(null);
    },
  },
  task: {
    count: () => Promise.resolve(mockTasks.length),
    findMany: () => Promise.resolve(mockTasks),
    findUnique: (args: any) => {
      const task = mockTasks.find(t => t.id === args.where.id);
      return Promise.resolve(task || null);
    },
    create: (args: any) => {
      const newTask = { ...args.data, id: Date.now().toString() };
      mockTasks.push(newTask);
      return Promise.resolve(newTask);
    },
    update: (args: any) => {
      const index = mockTasks.findIndex(t => t.id === args.where.id);
      if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...args.data };
        return Promise.resolve(mockTasks[index]);
      }
      return Promise.resolve(null);
    },
    delete: (args: any) => {
      const index = mockTasks.findIndex(t => t.id === args.where.id);
      if (index !== -1) {
        const deleted = mockTasks.splice(index, 1)[0];
        return Promise.resolve(deleted);
      }
      return Promise.resolve(null);
    },
  },
  taskComment: {
    count: () => Promise.resolve(mockTaskComments.length),
    findMany: () => Promise.resolve(mockTaskComments),
    findUnique: (args: any) => {
      const comment = mockTaskComments.find(c => c.id === args.where.id);
      return Promise.resolve(comment || null);
    },
    create: (args: any) => {
      const newComment = { ...args.data, id: Date.now().toString() };
      mockTaskComments.push(newComment);
      return Promise.resolve(newComment);
    },
    update: (args: any) => {
      const index = mockTaskComments.findIndex(c => c.id === args.where.id);
      if (index !== -1) {
        mockTaskComments[index] = { ...mockTaskComments[index], ...args.data };
        return Promise.resolve(mockTaskComments[index]);
      }
      return Promise.resolve(null);
    },
    delete: (args: any) => {
      const index = mockTaskComments.findIndex(c => c.id === args.where.id);
      if (index !== -1) {
        const deleted = mockTaskComments.splice(index, 1)[0];
        return Promise.resolve(deleted);
      }
      return Promise.resolve(null);
    },
  },
};

// Helper function to check if we should use mock database
export function shouldUseMockDb(): boolean {
  const dbUrl = process.env.DATABASE_URL || '';
  return dbUrl.includes('username:password@hostname:port') || 
         dbUrl === '' || 
         !dbUrl.startsWith('postgresql://');
}

// Database client factory
export function getDbClient() {
  if (shouldUseMockDb()) {
    return mockDb;
  }
  
  // Import and return the real Prisma client
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  };
  
  const prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: ['query'],
    });
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
  
  return prismaClient;
}
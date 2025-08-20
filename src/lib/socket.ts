import { io, Socket } from 'socket.io-client';
import React from 'react';

interface SocketEvents {
  // Task events
  'task:created': (task: any) => void;
  'task:updated': (task: any) => void;
  'task:deleted': (taskId: string) => void;
  'task:moved': (data: { taskId: string; newStatus: string }) => void;
  
  // Comment events
  'comment:added': (comment: any) => void;
  
  // Project events
  'project:created': (project: any) => void;
  'project:updated': (project: any) => void;
  'project:deleted': (projectId: string) => void;
  
  // Organization events
  'organization:created': (org: any) => void;
  'organization:updated': (org: any) => void;
  'organization:deleted': (orgId: string) => void;
  
  // Connection events
  'connect': () => void;
  'disconnect': () => void;
  'error': (error: any) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<keyof SocketEvents, Set<(args: any[]) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    // Initialize listeners map
    const events: (keyof SocketEvents)[] = [
      'task:created', 'task:updated', 'task:deleted', 'task:moved',
      'comment:added',
      'project:created', 'project:updated', 'project:deleted',
      'organization:created', 'organization:updated', 'organization:deleted',
      'connect', 'disconnect', 'error'
    ];
    
    events.forEach(event => {
      this.listeners.set(event, new Set());
    });
  }

  connect(url: string = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', options: any = {}) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        ...options
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to connect to socket:', error);
      this.emit('error', error);
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('disconnect');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('error', error);
    });

    // Task events
    this.socket.on('task:created', (task) => {
      console.log('Task created:', task);
      this.emit('task:created', task);
    });

    this.socket.on('task:updated', (task) => {
      console.log('Task updated:', task);
      this.emit('task:updated', task);
    });

    this.socket.on('task:deleted', (taskId) => {
      console.log('Task deleted:', taskId);
      this.emit('task:deleted', taskId);
    });

    this.socket.on('task:moved', (data) => {
      console.log('Task moved:', data);
      this.emit('task:moved', data);
    });

    // Comment events
    this.socket.on('comment:added', (comment) => {
      console.log('Comment added:', comment);
      this.emit('comment:added', comment);
    });

    // Project events
    this.socket.on('project:created', (project) => {
      console.log('Project created:', project);
      this.emit('project:created', project);
    });

    this.socket.on('project:updated', (project) => {
      console.log('Project updated:', project);
      this.emit('project:updated', project);
    });

    this.socket.on('project:deleted', (projectId) => {
      console.log('Project deleted:', projectId);
      this.emit('project:deleted', projectId);
    });

    // Organization events
    this.socket.on('organization:created', (org) => {
      console.log('Organization created:', org);
      this.emit('organization:created', org);
    });

    this.socket.on('organization:updated', (org) => {
      console.log('Organization updated:', org);
      this.emit('organization:updated', org);
    });

    this.socket.on('organization:deleted', (orgId) => {
      console.log('Organization deleted:', orgId);
      this.emit('organization:deleted', orgId);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event subscription methods
  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
  }

  off<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit<K extends keyof SocketEvents>(event: K, ...args: any[]) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in socket event handler for ${event}:`, error);
        }
      });
    }
  }

  // Room management
  joinRoom(room: string) {
    if (this.socket?.connected) {
      this.socket.emit('join:room', room);
    }
  }

  leaveRoom(room: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave:room', room);
    }
  }

  // Task operations
  createTask(task: any) {
    if (this.socket?.connected) {
      this.socket.emit('create:task', task);
    }
  }

  updateTask(task: any) {
    if (this.socket?.connected) {
      this.socket.emit('update:task', task);
    }
  }

  deleteTask(taskId: string) {
    if (this.socket?.connected) {
      this.socket.emit('delete:task', taskId);
    }
  }

  moveTask(taskId: string, newStatus: string) {
    if (this.socket?.connected) {
      this.socket.emit('move:task', { taskId, newStatus });
    }
  }

  // Comment operations
  addComment(comment: any) {
    if (this.socket?.connected) {
      this.socket.emit('add:comment', comment);
    }
  }

  // Project operations
  createProject(project: any) {
    if (this.socket?.connected) {
      this.socket.emit('create:project', project);
    }
  }

  updateProject(project: any) {
    if (this.socket?.connected) {
      this.socket.emit('update:project', project);
    }
  }

  deleteProject(projectId: string) {
    if (this.socket?.connected) {
      this.socket.emit('delete:project', projectId);
    }
  }

  // Organization operations
  createOrganization(org: any) {
    if (this.socket?.connected) {
      this.socket.emit('create:organization', org);
    }
  }

  updateOrganization(org: any) {
    if (this.socket?.connected) {
      this.socket.emit('update:organization', org);
    }
  }

  deleteOrganization(orgId: string) {
    if (this.socket?.connected) {
      this.socket.emit('delete:organization', orgId);
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionInfo() {
    return {
      connected: this.isConnected(),
      id: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Export singleton instance
export const socketService = new SocketService();

// Setup function for server-side socket configuration
export function setupSocket(io: any) {
  console.log('Setting up Socket.IO server...');
  
  io.on('connection', (socket: any) => {
    console.log('Client connected:', socket.id);
    
    // Handle room joining
    socket.on('join:room', (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });
    
    // Handle room leaving
    socket.on('leave:room', (room: string) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room: ${room}`);
    });
    
    // Task events
    socket.on('create:task', (task: any) => {
      io.emit('task:created', task);
    });
    
    socket.on('update:task', (task: any) => {
      io.emit('task:updated', task);
    });
    
    socket.on('delete:task', (taskId: string) => {
      io.emit('task:deleted', taskId);
    });
    
    socket.on('move:task', (data: { taskId: string; newStatus: string }) => {
      io.emit('task:moved', data);
    });
    
    // Comment events
    socket.on('add:comment', (comment: any) => {
      io.emit('comment:added', comment);
    });
    
    // Project events
    socket.on('create:project', (project: any) => {
      io.emit('project:created', project);
    });
    
    socket.on('update:project', (project: any) => {
      io.emit('project:updated', project);
    });
    
    socket.on('delete:project', (projectId: string) => {
      io.emit('project:deleted', projectId);
    });
    
    // Organization events
    socket.on('create:organization', (org: any) => {
      io.emit('organization:created', org);
    });
    
    socket.on('update:organization', (org: any) => {
      io.emit('organization:updated', org);
    });
    
    socket.on('delete:organization', (orgId: string) => {
      io.emit('organization:deleted', orgId);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  console.log('Socket.IO server setup complete');
}

// React hook for socket events
export function useSocket<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K], deps: any[] = []) {
  React.useEffect(() => {
    socketService.on(event, callback);
    
    return () => {
      socketService.off(event, callback);
    };
  }, deps);
}

// Hook for connection status
export function useSocketConnection() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionInfo, setConnectionInfo] = React.useState<any>(null);

  React.useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleError = (error: any) => {
      console.error('Socket error:', error);
      setIsConnected(false);
    };

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('error', handleError);

    // Update connection info periodically
    const interval = setInterval(() => {
      setConnectionInfo(socketService.getConnectionInfo());
    }, 1000);

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('error', handleError);
      clearInterval(interval);
    };
  }, []);

  return { isConnected, connectionInfo };
}
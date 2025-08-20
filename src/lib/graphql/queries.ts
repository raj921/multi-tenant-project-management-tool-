import { gql } from '@apollo/client';

// Organization queries
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
      owner {
        id
        username
        email
      }
    }
  }
`;

export const GET_MY_ORGANIZATIONS = gql`
  query GetMyOrganizations {
    myOrganizations {
      id
      name
      slug
      contactEmail
      createdAt
      owner {
        id
        username
        email
      }
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      createdAt
      owner {
        id
        username
        email
      }
      members {
        id
        username
        email
      }
    }
  }
`;

// Project queries
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      edges {
        node {
          id
          name
          description
          status
          dueDate
          createdAt
          taskCount
          completedTasksCount
          completionRate
          organization {
            id
            name
            slug
          }
          createdBy {
            id
            username
          }
        }
      }
    }
  }
`;

export const GET_PROJECTS_BY_ORGANIZATION = gql`
  query GetProjectsByOrganization($organizationSlug: String!) {
    projectsByOrganization(organizationSlug: $organizationSlug) {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
      }
    }
  }
`;

// Task queries
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      edges {
        node {
          id
          title
          description
          status
          priority
          assigneeEmail
          dueDate
          createdAt
          project {
            id
            name
            organization {
              id
              name
              slug
            }
          }
          createdBy {
            id
            username
          }
        }
      }
    }
  }
`;

export const GET_TASKS_BY_PROJECT = gql`
  query GetTasksByProject($projectId: ID!) {
    tasksByProject(projectId: $projectId) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_MY_TASKS = gql`
  query GetMyTasks {
    myTasks {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

// Task comment queries
export const GET_COMMENTS_BY_TASK = gql`
  query GetCommentsByTask($taskId: ID!) {
    commentsByTask(taskId: $taskId) {
      id
      content
      authorEmail
      timestamp
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_ORGANIZATIONS_WITH_STATS = gql`
  query GetOrganizationsWithStats {
    organizationsWithStats {
      id
      name
      slug
      contactEmail
      createdAt
      projectCount
      totalTasks
      completedTasks
      owner {
        id
        username
        email
      }
    }
  }
`;

export const SEARCH_ORGANIZATIONS = gql`
  query SearchOrganizations($query: String!) {
    searchOrganizations(query: $query) {
      id
      name
      slug
      contactEmail
      createdAt
      owner {
        id
        username
        email
      }
    }
  }
`;

// Project queries
export const GET_PROJECTS_WITH_STATS = gql`
  query GetProjectsWithStats {
    projectsWithStats {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasksCount
      inProgressTasksCount
      todoTasksCount
      overdueTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const SEARCH_PROJECTS = gql`
  query SearchProjects($query: String!) {
    searchProjects(query: $query) {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_PROJECTS_BY_STATUS = gql`
  query GetProjectsByStatus($status: String!) {
    projectsByStatus(status: $status) {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_PROJECTS_DUE_SOON = gql`
  query GetProjectsDueSoon($days: Int) {
    projectsDueSoon(days: $days) {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasksCount
      completionRate
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
      }
    }
  }
`;

// Task queries
export const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($status: String!) {
    tasksByStatus(status: $status) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_TASKS_BY_PRIORITY = gql`
  query GetTasksByPriority($priority: String!) {
    tasksByPriority(priority: $priority) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_TASKS_BY_ASSIGNEE = gql`
  query GetTasksByAssignee($email: String!) {
    tasksByAssignee(email: $email) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_OVERDUE_TASKS = gql`
  query GetOverdueTasks {
    overdueTasks {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_TASKS_DUE_SOON = gql`
  query GetTasksDueSoon($days: Int) {
    tasksDueSoon(days: $days) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_HIGH_PRIORITY_TASKS = gql`
  query GetHighPriorityTasks {
    highPriorityTasks {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const SEARCH_TASKS = gql`
  query SearchTasks($query: String!) {
    searchTasks(query: $query) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_TASKS_WITH_COMMENT_COUNT = gql`
  query GetTasksWithCommentCount {
    tasksWithCommentCount {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      commentCount
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      createdBy {
        id
        username
      }
    }
  }
`;

// Task comment queries
export const GET_RECENT_COMMENTS = gql`
  query GetRecentComments($days: Int) {
    recentComments(days: $days) {
      id
      content
      authorEmail
      timestamp
      task {
        id
        title
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_COMMENTS_BY_AUTHOR = gql`
  query GetCommentsByAuthor($email: String!) {
    commentsByAuthor(email: $email) {
      id
      content
      authorEmail
      timestamp
      task {
        id
        title
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const SEARCH_COMMENTS = gql`
  query SearchComments($query: String!) {
    searchComments(query: $query) {
      id
      content
      authorEmail
      timestamp
      task {
        id
        title
      }
      createdBy {
        id
        username
      }
    }
  }
`;

// User queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      firstName
      lastName
      dateJoined
    }
  }
`;
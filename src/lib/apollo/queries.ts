import { gql } from '@apollo/client';

// Organization queries and mutations
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
      updatedAt
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

export const GET_MY_ORGANIZATIONS = gql`
  query GetMyOrganizations {
    myOrganizations {
      id
      name
      slug
      contactEmail
      createdAt
      updatedAt
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
      updatedAt
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

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: OrganizationInput!) {
    createOrganization(input: $input) {
      organization {
        id
        name
        slug
        contactEmail
        createdAt
        updatedAt
        owner {
          id
          username
          email
        }
      }
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: OrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      organization {
        id
        name
        slug
        contactEmail
        updatedAt
      }
    }
  }
`;

// Project queries and mutations
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
          updatedAt
          organization {
            id
            name
            slug
          }
          createdBy {
            id
            username
            email
          }
          taskCount
          completedTasksCount
          completionRate
        }
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
      updatedAt
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
        email
      }
      taskCount
      completedTasksCount
      completionRate
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
      updatedAt
      organization {
        id
        name
        slug
      }
      createdBy {
        id
        username
        email
      }
      taskCount
      completedTasksCount
      completionRate
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      project {
        id
        name
        description
        status
        dueDate
        createdAt
        updatedAt
        organization {
          id
          name
          slug
        }
        createdBy {
          id
          username
          email
        }
        taskCount
        completedTasksCount
        completionRate
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
      project {
        id
        name
        description
        status
        dueDate
        updatedAt
      }
    }
  }
`;

// Task queries and mutations
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
          updatedAt
          project {
            id
            name
            organization {
              id
              name
            }
          }
          createdBy {
            id
            username
            email
          }
        }
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
      updatedAt
      project {
        id
        name
        organization {
          id
          name
        }
      }
      createdBy {
        id
        username
        email
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
      updatedAt
      project {
        id
        name
      }
      createdBy {
        id
        username
        email
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      task {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
        createdAt
        updatedAt
        project {
          id
          name
        }
        createdBy {
          id
          username
          email
        }
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskInput!) {
    updateTask(id: $id, input: $input) {
      task {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
        updatedAt
      }
    }
  }
`;

// Task comment queries and mutations
export const GET_COMMENTS_BY_TASK = gql`
  query GetCommentsByTask($taskId: ID!) {
    commentsByTask(taskId: $taskId) {
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
        email
      }
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment($input: TaskCommentInput!) {
    addTaskComment(input: $input) {
      comment {
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
          email
        }
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
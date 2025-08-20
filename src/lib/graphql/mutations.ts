import { gql } from '@apollo/client';

// Organization mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: OrganizationInput!) {
    createOrganization(input: $input) {
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

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: OrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
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

// Project mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
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

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
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

// Task mutations
export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
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

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskInput!) {
    updateTask(id: $id, input: $input) {
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

// Task comment mutations
export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment($input: TaskCommentInput!) {
    addTaskComment(input: $input) {
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
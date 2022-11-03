import { gql } from "@apollo/client";

export const ADD_TODO = gql`
  mutation add_todo(
    $userId: String!
    $title: String!
    $description: String!
    $dueDate: String!
  ) {
    add_todo(
      userId: $userId
      title: $title
      description: $description
      dueDate: $dueDate
    ) {
      todo {
        userId
        id
        title
        description
        dueDate
        completed
      }
      success
      errors
    }
  }
`;

export const GET_ALL_TODOS = gql`
  query getAllTodo {
    todos {
      todos {
        id
        title
        completed
        description
        dueDate
        userId
      }
      success
      erorrs
    }
  }
`;

export const GET_ONE_TODO = gql`
  query getOneTodo($id: ID!) {
    todo(id: $id) {
      todo {
        id
        title
        completed
        description
        dueDate
        userId
      }
      success
    }
  }
`;

export const GET_USER_TODOS = gql`
  query user_todos($userId: String!) {
    todos_user(userId: $userId) {
      todos {
        userId
        id
        title
        description
        completed
        dueDate
      }
      success
      errors
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation update_todo(
    $id: ID!
    $title: String!
    $description: String!
    $dueDate: String!
  ) {
    update_todo(
      id: $id
      title: $title
      description: $description
      dueDate: $dueDate
    ) {
      todo {
        id
        userId
        title
        description
        dueDate
        completed
      }
      success
      errors
    }
  }
`;

export const MARK_DONE = gql`
  mutation mark_done($id: ID!, $completed: Boolean!) {
    mark_done(id: $id, completed: $completed) {
      todo {
        id
        title
        completed
      }
      success
      errors
    }
  }
`;

export const DELETE_TODO = gql`
  mutation delete_todo($id: ID!) {
    delete_todo(id: $id) {
      success
      errors
    }
  }
`;

export const GET_USER = gql`
query getUser($username: String!) {
  user(username: $username) {
    user {
      username
      premium
    }
    success
    errors
  }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!) {
  add_user(username: $username) {
    user {
      username
      premium
    }
    success
    errors
  }
}
`;

export const MAKE_PREMIUM = gql`
mutation makePremium($username: String!) {
  make_premium(username: $username) {
    user {
      username
      premium
    }
    success
    errors
  }
}
`;

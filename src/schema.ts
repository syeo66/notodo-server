import { buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  scalar DateTime

  type User {
    id: ID!,
    createdAt: DateTime!
    userName: String!
    firstName: String!
    lastName: String!
  }

  input TodoInput {
    title: String!
    scheduledAt: DateTime
    doneAt: DateTime
  }

  type Todo {
      id: ID!
      title: String!
      createdAt: DateTime!
      scheduledAt: DateTime
      doneAt: DateTime
  }

  type Token {
    success: Boolean!
    message: String!
    token: String!
    tokenExpiry: DateTime!
  }

  input UpdateTodoInput {
    title: String
    scheduledAt: DateTime
    doneAt: DateTime
  }

  type Query {
    allTodos: [Todo!]!
    login(username: String!, password: String!): Token!
    profile: User!
    refresh(): Token!
    todo(id: String!): Todo!
    todos(date: String): [Todo!]!
  }

  type Mutation {
    createTodo(todo: TodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
    updateTodo(id: ID, todo: UpdateTodoInput!): Todo!
  }
`)

export default schema

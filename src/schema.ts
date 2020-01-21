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
    message: String!
    token: String!
  }

  type Query {
    allTodos: [Todo!]!
    todos(date: String): [Todo!]!
    todo(id: String!): Todo!
    profile: User!
    login(username: String!, password: String!): Token!
  }

  type Mutation {
    createTodo(todo: TodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
    updateTodo(id: ID, todo: TodoInput!): Todo!
  }
`)

export default schema

import { buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  scalar DateTime

  type Todo {
      id: ID!
      title: String!
      createdAt: DateTime
      scheduledAt: DateTime
      doneAt: DateTime
  }

  type Query {
      todos: [Todo!]!
      todo(id: String!): Todo!
  }
`)

export default schema

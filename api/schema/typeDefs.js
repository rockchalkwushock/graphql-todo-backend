export default `
  type Todo {
    completed: Boolean
    createdAt: String!
    id: ID!
    text: String!
    updatedAt: String!
    userId: ID!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    todos: [Todo!]!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    findAllUsers: [User!]!
    findUserById(id: ID!): User
    findUserTodos(userId: ID!): [Todo!]!
    me: User
  }
  type Mutation {
    completeTodo(id: ID!, completed: Boolean, userId: ID!): Int!
    createTodo(text: String!, userId: ID!): Todo!
    updateTodo(id: ID! newText: String!, userId: ID!): Int!
    deleteTodo(id: ID!, userId: ID!): Int!
    updateUser(id: ID!, newUsername: String!): Int!
    deleteUser(id: ID!): Int!
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
  }
`

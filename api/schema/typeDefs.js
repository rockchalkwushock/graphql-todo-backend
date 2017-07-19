export default `
  type Todo {
    completed: Boolean
    createdAt: String!
    id: ID!
    text: String!
    updatedAt: String!
    user_id: ID!
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
    findUserTodos(user_id: ID!): [Todo!]!
    me: User
  }
  type Mutation {
    completeTodo(id: ID!, completed: Boolean, user_id: ID!): Int!
    createTodo(text: String!, user_id: ID!): Todo!
    updateTodo(id: ID! newText: String!, user_id: ID!): Int!
    deleteTodo(id: ID!, user_id: ID!): Int!
    updateUser(id: ID!, newUsername: String!): Int!
    deleteUser(id: ID!): Int!
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
  }
`

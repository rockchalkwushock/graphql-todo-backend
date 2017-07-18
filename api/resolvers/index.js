export default {
  User: {
    todos: ({ id }, args, { models }) =>
      models.Todo.findAll({
        where: { id }
      })
  },
  Todo: {
    userId: ({ id }, args, { models }) => models.User.findById(id)
  },
  Query: {
    findAllUsers: (parent, args, { models }) => models.User.findAll(),
    findUserById: (parent, { id }, { models }) => models.User.findById(id),
    findUserTodos: (parent, { userId }, { models }) =>
      models.Todo.findAll({
        where: {
          userId
        }
      })
  },
  Mutation: {
    /**
     * REVIEW
     *
     * At the moment if I perform a CRUD operation on a Todo that
     * does not belong to the user the return value is 0.
     *
     * QUESTION
     *
     * How to handle error case & presentation?
     */
    completeTodo: (parent, { id, completed, userId }, { models }) =>
      models.Todo.update({ completed }, { where: { id, userId } }),
    createTodo: (parent, args, { models }) => models.Todo.create(args),
    updateTodo: (parent, { id, newText, userId }, { models }) =>
      models.Todo.update({ text: newText }, { where: { id, userId } }),
    deleteTodo: (parent, { id, userId }, { models }) =>
      models.Todo.destroy({ where: { id, userId } }),
    createUser: (parent, args, { models }) => models.User.create(args),
    updateUser: (parent, { id, newUsername }, { models }) =>
      models.User.update({ username: newUsername }, { where: { id } }),
    deleteUser: (parent, { id }, { models }) =>
      models.User.destroy({ where: { id } })
  }
}

import { loginValidation } from '../services'

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
      }),
    me: (parent, args, { models, user }) => {
      if (user) {
        return models.User.findOne({
          where: {
            id: user
          }
        })
      }
      // TODO: Handle error of user not being logged in.
      // redirect & error message.
      return null
    }
  },
  Mutation: {
    completeTodo: (parent, { id, completed, userId }, { models }) =>
      models.Todo.update({ completed }, { where: { id, userId } }),
    createTodo: (parent, args, { models }) => models.Todo.create(args),
    updateTodo: (parent, { id, newText, userId }, { models }) =>
      models.Todo.update({ text: newText }, { where: { id, userId } }),
    deleteTodo: (parent, { id, userId }, { models }) =>
      models.Todo.destroy({ where: { id, userId } }),
    updateUser: (parent, { id, newUsername }, { models }) =>
      models.User.update({ username: newUsername }, { where: { id } }),
    deleteUser: (parent, { id }, { models }) =>
      models.User.destroy({ where: { id } }),
    register: (parent, args, { models }) => models.User.create(args),
    login: (parent, { email, password }, { models, env }) =>
      loginValidation(email, password, models, env)
  }
}

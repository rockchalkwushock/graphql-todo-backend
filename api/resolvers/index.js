import { loginValidation } from '../services'
import { userAdded } from '../subscriptions'

export default {
  Subscriptions: {
    userAdded: {
      subscribe: userAdded.subscribe()
    }
  },
  User: {
    // Use dataloader to batch & cache the queries here.
    todos: ({ id }, args, { todoLoader }) => todoLoader.load(id)
  },
  Todo: {
    user_id: ({ id }, args, { models }) => models.User.findById(id)
  },
  Query: {
    findAllUsers: (parent, args, { models }) => models.User.findAll(),
    findUserById: (parent, { id }, { models }) => models.User.findById(id),
    findUserTodos: (parent, { user_id }, { models }) =>
      models.Todo.findAll({
        where: {
          user_id
        }
      })
    // me: (parent, args, { models, user }) => {
    //   if (user) {
    //     return models.User.findOne({
    //       where: {
    //         id: user
    //       }
    //     })
    //   }
    //   // TODO: Handle error of user not being logged in.
    //   // redirect & error message.
    //   return null
    // }
  },
  Mutation: {
    completeTodo: (parent, { id, completed, user_id }, { models }) =>
      models.Todo.update({ completed }, { where: { id, user_id } }),
    createTodo: (parent, args, { models }) => models.Todo.create(args),
    updateTodo: (parent, { id, newText, user_id }, { models }) =>
      models.Todo.update({ text: newText }, { where: { id, user_id } }),
    deleteTodo: (parent, { id, user_id }, { models }) =>
      models.Todo.destroy({ where: { id, user_id } }),
    updateUser: (parent, { id, newUsername }, { models }) =>
      models.User.update({ username: newUsername }, { where: { id } }),
    deleteUser: (parent, { id }, { models }) =>
      models.User.destroy({ where: { id } }),
    register: async (parent, { email, password, username }, { models }) => {
      // Must create User first.
      const newUser = await models.User.create({ username })
      // Publish the event to everyone.
      userAdded.publish(newUser)
      // LocalAuth depends on association at 'user_id'.
      // NOTE: LocalAuth is what is being returned. This `id` being returned
      // is NOT the id associated with `users`.
      return models.LocalAuth.create({
        email,
        password,
        user_id: newUser.id
      })
    },
    login: (parent, { email, password }, { models, env }) =>
      loginValidation(email, password, models, env)
  }
}

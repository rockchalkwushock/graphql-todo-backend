// import faker from 'faker'
import { graphql } from 'graphql'

import { mocks } from './mocks'
import models from './api/models'
import schema from './api/schema'

/**
 * @desc
 *  - connects to 'graphql_todo_test'.
 *  - force: true - will drop all existing tables prior to creating (cleanup) :smile:
 */
export const connect = async () => {
  await models.sequelize.sync({ force: true })
}

const generateUsers = async () => {
  await Promise.all([
    graphql(
      schema,
      mocks.register('TheRealTurd', 'turd_ferguson@gmail.com', '12345678'),
      {},
      { models }
    ),
    graphql(
      schema,
      mocks.register('Dr_Acula', 'dr_acula@gmail.com', 'abcdefgh'),
      {},
      { models }
    )
  ])
}

const generateTodos = async () => {
  const { data: { findAllUsers } } = await graphql(
    schema,
    mocks.findAllUsers,
    {},
    { models }
  )
  await Promise.all([
    graphql(
      schema,
      mocks.createTodo('Hello World', findAllUsers[0].id),
      {},
      { models }
    ),
    graphql(
      schema,
      mocks.createTodo('I am Turd', findAllUsers[0].id),
      {},
      { models }
    ),
    graphql(
      schema,
      mocks.createTodo('Here me RWOAR@!', findAllUsers[0].id),
      {},
      { models }
    )
  ])
}

export const testSetup = async () => {
  // cannot run in parallel dummy!
  await generateUsers()
  await generateTodos()
}

// NOTE don't use drop! Tables go bye-bye, you must reconnect then...this supposedly will work?
// @see https://stackoverflow.com/questions/31414050/postgresql-empty-table
export const cleanUp = async () => {
  await Promise.all([
    models.FBAuth.truncate(),
    models.LocalAuth.truncate(),
    models.Todo.truncate(),
    models.User.truncate(),
    models.VKAuth.truncate()
  ])
}

export const testTearDown = async () => {
  // Empty the tables before closing the connection
  // NOTE: 'users' will not truncate do to the following error message in pSequel
  // REVIEW: ERROR: cannot truncate table referenced in a foreign key constraint.
  await cleanUp()
  await models.sequelize.close()
}

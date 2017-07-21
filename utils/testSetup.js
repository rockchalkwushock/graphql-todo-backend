import { graphql } from 'graphql'

import mocks from './mocks'
import models from '../api/models'
import schema from '../api/schema'

/**
 * NOTES
 *
 * I have considered and ran `generateUsers` & `generateTodos` using
 * Promise.all([...]). The speed of the test suite makes great strides,
 * however at the unpredictable possibility of promises resolving in a
 * differing order. This unpredictability leads to test failing: no bueno.
 */

/**
 * @desc
 *  - connects to 'graphql_todo_test'.
 *  - force: true - will drop all existing tables prior to creating (cleanup)
 */
export const connect = async () => {
  await models.sequelize.sync({ force: true })
}

const generateUsers = async () => {
  await graphql(
    schema,
    mocks.register('TheRealTurd', 'turd_ferguson@gmail.com', '12345678'),
    {},
    { models }
  )
  await graphql(
    schema,
    mocks.register('Dr_Acula', 'dr_acula@gmail.com', 'abcdefgh'),
    {},
    { models }
  )
}

const generateTodos = async () => {
  const { data: { findAllUsers } } = await graphql(
    schema,
    mocks.findAllUsers,
    {},
    { models }
  )
  await graphql(
    schema,
    mocks.createTodo('Hello World', findAllUsers[0].id),
    {},
    { models }
  )
  await graphql(
    schema,
    mocks.createTodo('I am Turd', findAllUsers[0].id),
    {},
    { models }
  )
  await graphql(
    schema,
    mocks.createTodo('Here me RWOAR@!', findAllUsers[0].id),
    {},
    { models }
  )
}

export const testSetup = async () => {
  // cannot run in parallel dummy!
  await generateUsers()
  await generateTodos()
}

export const testTearDown = async () => {
  // Empty the tables before closing the connection
  // NOTE: 'users' will not truncate do to the following error message in pSequel
  // REVIEW: ERROR: cannot truncate table referenced in a foreign key constraint.
  await models.sequelize.close()
}

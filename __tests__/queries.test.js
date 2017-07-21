import { graphql } from 'graphql'

import models from '../api/models'
import schema from '../api/schema'
import { connect, mocks, testSetup, testTearDown } from '../utils'

/**
 * TODO
 *
 * 1) Need to test the case of user2 trying to update or delete todos of user1.
 * 2) Continue refactoring the test suite to make it:
 *    - less prone to error/fail "less code, less to worry about"
 *    - more readable
 *    - dry
 *    - repeatable
 *
 * NOTE
 *
 * When using string template literals in the query string template literal
 * you MUST wrap the variable in double quotes just as you would do in the
 * graphical interface:
 *
 * @example
 * const query = `
 *    findUserById(id: "${id}") {
 *      username
 *    }
 * `
 */

describe('Queries Test Suite', () => {
  beforeEach(async () => {
    try {
      await connect()
      await testSetup()
    } catch (e) {
      throw new Error('Test Setup is failing')
    }
  })

  test('#1: should return array of 2 users', async () => {
    try {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      expect.assertions(1)
      expect(findAllUsers).toHaveLength(2)
    } catch (e) {
      throw e
    }
  })

  test('#2: should find user by id', async () => {
    try {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { data: { findUserById } } = await graphql(
        schema,
        mocks.findUserById(findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(findUserById).toHaveProperty('username', 'TheRealTurd')
    } catch (e) {
      throw e
    }
  })

  test('#3: should find all of user todos', async () => {
    try {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { data: { findUserTodos } } = await graphql(
        schema,
        mocks.findUserTodos(findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(4)
      expect(findUserTodos).toHaveLength(3)
      expect(findUserTodos[0]).toHaveProperty('id')
      expect(findUserTodos[0]).toHaveProperty('completed', false)
      expect(findUserTodos[0]).toHaveProperty('text', 'Hello World')
    } catch (e) {
      throw e
    }
  })
  afterAll(async () => {
    try {
      await testTearDown()
    } catch (e) {
      throw new Error('Connection still present...damnit!')
    }
  })
})

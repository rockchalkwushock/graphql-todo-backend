import { graphql } from 'graphql'

import { env } from '../api/config'
import models from '../api/models'
import schema from '../api/schema'
import { connect, testSetup, testTearDown } from '../testUtils'
import { mocks } from '../mocks'

/**
 * TODO
 *
 * 1) Need to test the case of user2 trying to update or delete todos of user1.
 * 2) Test FB & VK Auth Strategies
 * 3) Split this god awful mess up into separate files:
 *    - auth
 *    - queries
 *    - mutations
 * 4) Continue refactoring the test suite to make it:
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

describe('Test Suite', () => {
  beforeAll(async () => {
    try {
      await connect()
    } catch (e) {
      throw new Error('Did not connect...what did you do dummy!')
    }
  })
  beforeEach(async () => {
    try {
      await testSetup()
    } catch (e) {
      throw new Error('Test Setup is failing')
    }
  })

  describe('Queries', () => {
    test('should return array of 2 users', async () => {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      expect.assertions(1)
      expect(findAllUsers).toHaveLength(2)
    })

    test('should find user by id', async () => {
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
    })

    test('should find all of user todos', async () => {
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
    })
  })

  describe('Resolvers', () => {
    test('should register a user', async () => {
      /**
       * QUESTION
       *
       * Why can I not return the username from this query?
       * Error Message: Cannot return null for non-nullable field User.username.
       */
      const { data: { register } } = await graphql(
        schema,
        mocks.register('jim_nasium', 'jim_teacher87@yahoo.com', '12345678'),
        {},
        { models }
      )
      expect.assertions(2)
      expect(register).toHaveProperty('id')
      expect(register).toHaveProperty('email', 'jim_teacher87@yahoo.com')
    })
    test('should return error on improper validation for username', async () => {
      const { errors } = await graphql(
        schema,
        mocks.register('', 'jim_teacher87@yahoo.com', '12345678'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty(
        'message',
        'Validation error: Username must be between 6 and 16 characters in length.'
      )
    })
    test('should return error on improper validation for email', async () => {
      const { errors } = await graphql(
        schema,
        mocks.register('jim_nasium', '', '12345678'),
        {},
        { models }
      )
      expect.assertions(1)
      console.log(errors[0])
      expect(errors[0]).toHaveProperty(
        'message',
        'Validation error: You must provide a valid email.'
      )
    })
    test('should return error on improper validation for password that is too short', async () => {
      const { errors } = await graphql(
        schema,
        mocks.register('jim_nasium', 'jim_teacher87@yahoo.com', 'abc'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty(
        'message',
        'Validation error: Password must be between 8 and 21 characters in length.'
      )
    })
    test('should return error on improper validation for password that is non-alphanumeric', async () => {
      const { errors } = await graphql(
        schema,
        mocks.register('jim_nasium', 'jim_teacher87@yahoo.com', '*/@#^&!+='),
        {},
        { models }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty(
        'message',
        'Validation error: Password must only include alphanumeric characters.'
      )
    })
    test.skip('should authenticate user', async () => {
      const { data: { login } } = await graphql(
        schema,
        mocks.login('turd_ferguson@gmail.com', '12345678'),
        {},
        { models, env }
      )
      console.log(login)
      // QUESTION How to test that we return a string???
    })
    test('should return error on improper validation for email not being found', async () => {
      const { errors } = await graphql(
        schema,
        mocks.login('', '12345678'),
        {},
        { models, env }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty('message', 'Email not found.')
    })
    test('should return error on improper validation for incorrect password', async () => {
      const { errors } = await graphql(
        schema,
        mocks.login('turd_ferguson@gmail.com', '87654321'),
        {},
        { models, env }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty('message', 'Incorrect Password')
    })
    test('should return 1 if username updated', async () => {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { data: { updateUser } } = await graphql(
        schema,
        mocks.updateUser(findAllUsers[0].id, 'Slim Turd'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(updateUser).toEqual(1)
    })
    test('should return 0 if update did not occur', async () => {
      const { data: { updateUser } } = await graphql(
        schema,
        mocks.updateUser('9919f1b7-2707-4544-82c2-63366c6a2f05', 'Jim Nasium'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(updateUser).toEqual(0)
    })
    test('should return error on improper validation for username', async () => {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { errors } = await graphql(
        schema,
        mocks.updateUser(findAllUsers[0].id, 'Turd'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty(
        'message',
        'Validation error: Username must be between 6 and 16 characters in length.'
      )
    })
    test('should return 1 upon user deletion', async () => {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { data: { deleteUser } } = await graphql(
        schema,
        mocks.deleteUser(findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(deleteUser).toEqual(1)
    })
    test('should return 0 upon failed user deletion', async () => {
      const { data: { deleteUser } } = await graphql(
        schema,
        mocks.deleteUser('9919f1b7-2707-4544-82c2-63366c6a2f05'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(deleteUser).toEqual(0)
    })
    test('should create a todo', async () => {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { data: { createTodo } } = await graphql(
        schema,
        mocks.createTodo('Go on SNL', findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(3)
      expect(createTodo).toHaveProperty('id')
      expect(createTodo).toHaveProperty('text', 'Go on SNL')
      expect(createTodo).toHaveProperty('completed', false)
    })
    test('should return error on improper validation: no text provided', async () => {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { errors } = await graphql(
        schema,
        mocks.createTodo('Do', findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty(
        'message',
        'Validation error: A todo must be at least 3 characters in length.'
      )
    })
    test('should return 1 upon updating a todo', async () => {
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
      const { data: { updateTodo } } = await graphql(
        schema,
        mocks.updateTodo(
          findUserTodos[0].id,
          'Learn GraphQL',
          findAllUsers[0].id
        ),
        {},
        { models }
      )
      expect.assertions(1)
      expect(updateTodo).toEqual(1)
    })
    test('should return 0 upon failure of updating a todo', async () => {
      const { data: { findAllUsers } } = await graphql(
        schema,
        mocks.findAllUsers,
        {},
        { models }
      )
      const { data: { updateTodo } } = await graphql(
        schema,
        mocks.updateTodo(
          findAllUsers[0].id,
          'Learn Elixir',
          findAllUsers[0].id
        ),
        {},
        { models }
      )
      expect.assertions(1)
      expect(updateTodo).toEqual(0)
    })
    test('should return error on improper validation: no newText provided', async () => {
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
      const { errors } = await graphql(
        schema,
        mocks.updateTodo(findUserTodos[0].id, '', findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty(
        'message',
        'Validation error: A todo must be at least 3 characters in length.'
      )
    })
    test('should mark a todo as completed', async () => {
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
      const { data: { completeTodo } } = await graphql(
        schema,
        mocks.completeTodo(findUserTodos[0].id, true, findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(completeTodo).toEqual(1)
    })
    test('should delete a todo', async () => {
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
      const { data: { deleteTodo } } = await graphql(
        schema,
        mocks.deleteTodo(findUserTodos[0].id, findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(deleteTodo).toEqual(1)
    })
  })

  afterAll(async () => await testTearDown())
})

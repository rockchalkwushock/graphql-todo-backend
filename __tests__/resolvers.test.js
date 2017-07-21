import { graphql } from 'graphql'

import { env } from '../api/config'
import models from '../api/models'
import schema from '../api/schema'
import { connect, mocks, testSetup, testTearDown } from '../utils'

describe('Resolvers Test Suite', () => {
  beforeEach(async () => {
    try {
      await connect()
      await testSetup()
    } catch (e) {
      throw new Error('Test Setup is failing')
    }
  })

  test('#1: should register a user', async () => {
    try {
      const { data: { register } } = await graphql(
        schema,
        mocks.register('jim_nasium', 'jim_teacher87@yahoo.com', '12345678'),
        {},
        { models }
      )
      expect.assertions(2)
      expect(register).toHaveProperty('id')
      expect(register).toHaveProperty('email', 'jim_teacher87@yahoo.com')
    } catch (e) {
      throw e
    }
  })

  test('#2: should return error on improper validation for username', async () => {
    try {
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
    } catch (e) {
      throw e
    }
  })

  test.skip(
    '#3: should return error on improper validation for email',
    async () => {
      try {
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
      } catch (e) {
        throw e
      }
    }
  )

  test.skip(
    '#4: should return error on improper validation for password that is too short',
    async () => {
      try {
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
      } catch (e) {
        throw e
      }
    }
  )

  test.skip(
    '#5: should return error on improper validation for password that is non-alphanumeric',
    async () => {
      try {
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
      } catch (e) {
        throw e
      }
    }
  )

  test.skip('#6: should authenticate user', async () => {
    try {
      const { data: { login } } = await graphql(
        schema,
        mocks.login('turd_ferguson@gmail.com', '12345678'),
        {},
        { models, env }
      )
      console.log(login)
      // QUESTION How to test that we return a string???
    } catch (e) {
      throw e
    }
  })

  test('#7: should return error on improper validation for email not being found', async () => {
    try {
      const { errors } = await graphql(
        schema,
        mocks.login('', '12345678'),
        {},
        { models, env }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty('message', 'Email not found.')
    } catch (e) {
      throw e
    }
  })

  test('#8: should return error on improper validation for incorrect password', async () => {
    try {
      const { errors } = await graphql(
        schema,
        mocks.login('turd_ferguson@gmail.com', '87654321'),
        {},
        { models, env }
      )
      expect.assertions(1)
      expect(errors[0]).toHaveProperty('message', 'Incorrect Password')
    } catch (e) {
      throw e
    }
  })

  test('#9: should return 1 if username updated', async () => {
    try {
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
    } catch (e) {
      throw e
    }
  })

  test('#10: should return 0 if update did not occur', async () => {
    try {
      const { data: { updateUser } } = await graphql(
        schema,
        mocks.updateUser('9919f1b7-2707-4544-82c2-63366c6a2f05', 'Jim Nasium'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(updateUser).toEqual(0)
    } catch (e) {
      throw e
    }
  })

  test('#11: should return error on improper validation for username', async () => {
    try {
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
    } catch (e) {
      throw e
    }
  })

  test('#12: should return 1 upon user deletion', async () => {
    try {
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
    } catch (e) {
      throw e
    }
  })

  test('#13: should return 0 upon failed user deletion', async () => {
    try {
      const { data: { deleteUser } } = await graphql(
        schema,
        mocks.deleteUser('9919f1b7-2707-4544-82c2-63366c6a2f05'),
        {},
        { models }
      )
      expect.assertions(1)
      expect(deleteUser).toEqual(0)
    } catch (e) {
      throw e
    }
  })

  test('#14: should create a todo', async () => {
    try {
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
    } catch (e) {
      throw e
    }
  })

  test('#15: should return error on improper validation: no text provided', async () => {
    try {
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
    } catch (e) {
      throw e
    }
  })

  test('#16: should return 1 upon updating a todo', async () => {
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
    } catch (e) {
      throw e
    }
  })

  test('#17: should return 0 upon failure of updating a todo', async () => {
    try {
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
    } catch (e) {
      throw e
    }
  })

  test('#18: should return error on improper validation: no newText provided', async () => {
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
    } catch (e) {
      throw e
    }
  })

  test('#19: should mark a todo as completed', async () => {
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
      const { data: { completeTodo } } = await graphql(
        schema,
        mocks.completeTodo(findUserTodos[0].id, true, findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(completeTodo).toEqual(1)
    } catch (e) {
      throw e
    }
  })

  test('#20: should delete a todo', async () => {
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
      const { data: { deleteTodo } } = await graphql(
        schema,
        mocks.deleteTodo(findUserTodos[0].id, findAllUsers[0].id),
        {},
        { models }
      )
      expect.assertions(1)
      expect(deleteTodo).toEqual(1)
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

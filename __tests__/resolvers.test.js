import { addMockFunctionsToSchema, MockList } from 'graphql-tools'
import { graphql } from 'graphql'
import faker from 'faker'

import schema from '../api/schema'

const mocks = {
  Todo: () => ({
    completed: faker.random.boolean,
    id: faker.random.uuid,
    text: faker.lorem.text
    // userId: '', QUESTION How to handle association? ie. FOREIGN KEY(userId) REFERENCES users(id)
  }),
  User: () => ({
    id: faker.random.uuid,
    username: faker.internet.userName,
    todos: () => new MockList(5) // QUESTION Can I say MockList(5, Todo)?
  })
  // QUESTION Do I need to continue on for Query & Mutation?
}

addMockFunctionsToSchema({
  schema,
  mocks,
  preserveResolvers: true
})

describe('Name of the group', () => {
  test('should behave...', async () => {
    const query = `
      query findAllUsers {
        id
        username
      }
    `
    const x = await graphql(schema, query)
    console.log(x) // FIXME currently renders errors object.
  })
})

import {
  addMockFunctionsToSchema,
  makeExecutableSchema,
  MockList
} from 'graphql-tools'
import { graphql } from 'graphql'
import faker from 'faker'

// Must use typeDefs not actual schema.
import typeDefs from '../api/schema/typeDefs'

// Create mocks for server.
const mocks = {
  Todo: () => ({
    completed: faker.random.boolean(),
    id: faker.random.uuid(),
    text: faker.lorem.text(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.future()
  }),
  User: () => ({
    id: faker.random.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.future(),
    todos: () => new MockList(5)
  })
}
const schema = makeExecutableSchema({ typeDefs })
addMockFunctionsToSchema({
  schema,
  mocks
})

describe('Queries', () => {
  beforeEach(async () => {
    const query1 = `
      mutation register {
        register(username: "turd_ferguson", email: "theRealTurd@gmail.com", password: "123") {
          id
          username
          email
        }
      }
    `
    const query2 = `
      mutation register {
        register(username: "Dr Acula", email: "fangs-a-lot@yahoo.com", password: "abc") {
          id
          username
          email
        }
      }
    `
    const z = await Promise.all([
      graphql(schema, query1),
      graphql(schema, query2)
    ])
    console.log(z[0].data.register)
    return z
  })

  test.only('should find users', async () => {
    const query = `
      query findAllUsers {
        findAllUsers {
          id
          username
        }
      }
    `
    const { data: { findAllUsers } } = await graphql(schema, query)
    console.log(findAllUsers)
    expect.assertions(3)
    expect(findAllUsers).toHaveLength(2)
    expect(findAllUsers[0]).toHaveProperty('id')
    expect(findAllUsers[0]).toHaveProperty('username')
  })

  test('should find User by Id', async () => {})

  test('should find Todos belonging to User', async () => {})

  test('should find current logged in User', async () => {})
})

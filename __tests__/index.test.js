import { graphql } from 'graphql'
// import faker from 'faker'

import models from '../api/models'
import schema from '../api/schema'
import { testSetup, testTearDown } from '../testUtils'

describe('Test Suite', () => {
  beforeEach(async () => await testSetup())

  describe('Queries', () => {
    test('should return array of 2 users', async () => {
      const query = `
        query {
          findAllUsers {
            id
            username
            createdAt
            updatedAt
          }
        }
      `
      const rootValue = {}
      const {
        data: { findAllUsers }
      } = await graphql(schema, query, rootValue, { models })
      expect.assertions(1)
      expect(findAllUsers).toHaveLength(2)
    })
  })

  describe('Resolvers', () => {})

  afterAll(async () => await testTearDown())
})

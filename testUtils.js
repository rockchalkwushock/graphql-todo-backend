// import faker from 'faker'
import { graphql } from 'graphql'

import models from './api/models'
import schema from './api/schema'

const query1 = `
  mutation {
    register(email:"turd_ferguson@gmail.com", password:"123", username:"TheRealTurd") {
      id
    }
  }
`
const query2 = `
  mutation {
    register(email:"dr_Acula@gmail.com", password:"abc", username:"Dr_Acula") {
      id
    }
  }
`

/**
 * @desc
 *  - connects to 'graphql_todo_test'.
 *  - force: true - will drop all existing tables prior to creating (cleanup) :smile:
 *  - logging: false - because the logging gets obscene!
 */
const connect = async () => {
  await models.sequelize.sync({ force: true, logging: false })
}

const generateUsers = async () => {
  await Promise.all([
    graphql(schema, query1, {}, { models }),
    graphql(schema, query2, {}, { models })
  ])
}

export const testSetup = async () => {
  // cannot run in parallel dummy!
  await connect()
  await generateUsers()
}

export const testTearDown = async () => {
  await models.sequelize.close()
}

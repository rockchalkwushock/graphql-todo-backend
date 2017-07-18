/* eslint-disable no-console */

import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

import schema from './schema'
import models from './models'

const PORT = 3000
// Use to set up force dropping tables in 'test'
const isProd = process.env.NODE_ENV !== 'production'
console.log(isProd)
console.log(!isProd)
const app = express()

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({ schema, context: { models } })
)

models.sequelize
  .sync({ force: isProd })
  .then(() => {
    app.listen(PORT, err => {
      if (err) return console.log(err)
      console.log(
        `GraphQL Server running on port ${PORT} in ${process.env.NODE_ENV}`
      )
    })
  })
  .catch(e => {
    console.log(e)
  })

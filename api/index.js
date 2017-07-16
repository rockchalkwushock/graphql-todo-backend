/* eslint-disable no-console */

import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

import schema from './schema'
import models from './models'

const PORT = 3000
const app = express()

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

models.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, err => {
      if (err) return console.log(err)
      console.log(`GraphQL Server running on port ${PORT}`)
    })
  })
  .catch(e => {
    console.log(e)
  })

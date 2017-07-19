/* eslint-disable no-console */
import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

import { env, middlewares } from './config'
import { authFacebook } from './services'
import schema from './schema'
import models from './models'

// Use to set up force dropping tables in 'test'
const isProd = process.env.NODE_ENV !== 'production'
const app = express()

// Apply middlewares
middlewares(app)

// Third-Party Authentication
app.get('/auth/facebook', authFacebook)
app.get('/auth/facebook/callback', authFacebook, (req, res) => {
  // TODO: Cleanup
  res.send('auth good')
})

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)
app.use(
  '/graphql',
  graphqlExpress(req => ({ schema, context: { models, env, user: req.user } }))
)

models.sequelize
  .sync({ force: isProd, logging: false }) // isProd on logging later.
  .then(() => {
    app.listen(env.PORT, err => {
      if (err) return console.log(err)
      console.log(
        `GraphQL Server running on port ${env.PORT} in ${process.env.NODE_ENV}`
      )
    })
  })
  .catch(e => {
    console.log(e)
  })

/* eslint-disable no-console */
import express from 'express'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import { env, middlewares } from './config'
import { authFacebook, authVkontakte } from './services'
import schema from './schema'
import models from './models'
import { todoLoader } from './loaders'

// Use to set up force dropping tables in 'test'
const isProd = process.env.NODE_ENV !== 'production'
const app = express()
const server = createServer(app)

// Apply middlewares
middlewares(app)

// Third-Party Authentication
app.get('/auth/facebook', authFacebook)
app.get('/auth/facebook/callback', authFacebook, (req, res) => {
  // TODO: Cleanup
  res.send('auth good')
})
app.get('/auth/vkontakte', authVkontakte)
app.get('/auth/vkontakte/callback', authVkontakte, (req, res) => {
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
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      env,
      user: req.user,
      todoLoader
    }
  }))
)

const subscriptionServer = new SubscriptionServer(
  {
    execute,
    subscribe,
    schema
  },
  {
    server,
    path: '/subscriptions'
  }
)

models.sequelize
  .sync({ force: isProd, logging: isProd })
  .then(() => {
    server.listen(env.PORT, err => {
      if (err) {
        return console.log(err)
      }
      subscriptionServer()
      console.log(
        `GraphQL Server running on port ${env.PORT} in ${process.env.NODE_ENV}`
      )
    })
  })
  .catch(e => {
    console.log(e)
  })

// models.sequelize
//   .sync({ force: isProd, logging: isProd })
//   .then(() => {
//     app.listen(env.PORT, err => {
//       if (err) return console.log(err)
//       console.log(
//         `GraphQL Server running on port ${env.PORT} in ${process.env.NODE_ENV}`
//       )
//     })
//   })
//   .catch(e => {
//     console.log(e)
//   })

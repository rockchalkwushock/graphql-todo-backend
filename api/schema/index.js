/* eslint-disable no-console */
import { makeExecutableSchema } from 'graphql-tools'

import typeDefs from './typeDefs'
import resolvers from '../resolvers'

// I can build a custom logger with `morgan` & `winston`.
const logger = { log: e => console.log(e) }

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  logger
})

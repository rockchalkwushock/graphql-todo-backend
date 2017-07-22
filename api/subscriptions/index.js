import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

const USER_ADDED = 'USER_ADDED'

export const userAdded = {
  publish: user =>
    pubsub.publish(USER_ADDED, {
      userAdded: user
    }),
  subscribe: () => pubsub.asyncIterator(USER_ADDED)
}

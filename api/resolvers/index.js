export default {
  Query: {
    // NOTE context is the object passed in graphqlExpress
    // We passed our models on context so we have access to
    // them in our resolvers.
    hello: (parent, args, context) => 'Hello World!'
  }
}

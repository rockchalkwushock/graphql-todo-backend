require('dotenv-safe').load()

const devConfig = {
  EXPIRE_TIME: '1y',
  JWT_SECRET: 'm3LL0wY3ll0w',
  PSQL_URI: `postgres://${process.env.PSQL_USER}:${process.env
    .PSQL_PASSWORD}@localhost:5432/graphql_todo_dev`
}

const testConfig = {
  EXPIRE_TIME: '1s',
  JWT_SECRET: 'm3LL0wY3ll0w',
  PSQL_URI: `postgres://${process.env.PSQL_USER}:${process.env
    .PSQL_PASSWORD}@localhost:5432/graphql_todo_test`
}

const prodConfig = {
  EXPIRE_TIME: process.env.EXPIRE_TIME,
  JWT_SECRET: process.env.JWT_SECRET,
  PSQL_URI: process.env.PSQL_URI
}

const defaultConfig = {
  PORT: process.env.PORT || 3000
}

function envConfig(env) {
  switch (env) {
    case 'development':
      return devConfig
    case 'test':
      return testConfig
    default:
      return prodConfig
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV)
}

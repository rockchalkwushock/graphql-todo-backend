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
  FB_APP: process.env.FB_APP_ID,
  FB_CALLBACK: process.env.FB_CALLBACK_URL,
  FB_SECRET: process.env.FB_APP_SECRET,
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

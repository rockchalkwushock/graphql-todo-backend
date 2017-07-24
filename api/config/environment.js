require('dotenv-safe').load()

const devConfig = {
  EXPIRE_TIME: '1y',
  JWT_SECRET: 'm3LL0wY3ll0w',
  PSQL_URI: process.env.PSQL_URI_DEV
}

const testConfig = {
  EXPIRE_TIME: '1s',
  JWT_SECRET: 'm3LL0wY3ll0w',
  PSQL_URI: process.env.PSQL_URI_TEST
}

const prodConfig = {
  EXPIRE_TIME: process.env.EXPIRE_TIME,
  JWT_SECRET: process.env.JWT_SECRET,
  PSQL_URI: process.env.PSQL_URI_PROD
}

const defaultConfig = {
  FB_APP: process.env.FB_APP_ID,
  FB_CALLBACK: process.env.FB_CALLBACK_URL,
  FB_SECRET: process.env.FB_APP_SECRET,
  PORT: process.env.PORT || 3000,
  VK_APP: process.env.VK_APP_ID,
  VK_CALLBACK: process.env.VK_CALLBACK_URL,
  VK_SECRET: process.env.VK_APP_SECRET
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

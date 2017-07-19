const npsUtils = require('nps-utils')

const { rimraf, concurrent, crossEnv, series } = npsUtils

module.exports = {
  scripts: {
    api: {
      default: `${crossEnv('NODE_ENV=production')} nodemon index.js`,
      dev: `${crossEnv('NODE_ENV=development')} nodemon index.js`
    },
    clean: series(rimraf('coverage')),
    commit: 'git cz',
    lint: {
      default: 'eslint __tests__ config modules services utils',
      fix: series.nps('lint --fix')
    },
    reportCoverage: 'codecov',
    test: {
      default: 'jest --config jest.config.json --runInBand',
      coverage: series.nps('test --coverage --silent'),
      watch: series.nps('test --watch')
    },
    validate: {
      default: concurrent.nps('lint', 'test'),
      withCoverage: concurrent.nps('lint', 'test.coverage')
    }
  }
}

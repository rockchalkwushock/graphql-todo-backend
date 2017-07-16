import Sequelize from 'sequelize'

let sequelize

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(
    'graphql_todo_test',
    'rockchalkwushock',
    process.env.PSQL_PASSWORD, {
      host: 'localhost',
      dialect: 'postgres'
    }
  )
} else if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(
    'graphql_todo_dev',
    'rockchalkwushock',
    process.env.PSQL_PASSWORD, {
      host: 'localhost',
      dialect: 'postgres'
    }
  )
} else if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.PSQL_URI)
}

/**
 * NOTE
 *
 * Executing(default):
 * CREATE TABLE IF NOT EXISTS "Users"
 * (
 * "id" SERIAL,
 * "username" VARCHAR(255),
 * "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
 * "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
 * PRIMARY KEY("id")
 * );
 */

const db = {
  // Todo: sequelize.import('./Todo'),
  User: sequelize.import('./User')
}

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db

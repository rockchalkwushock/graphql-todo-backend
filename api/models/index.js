import Sequelize from 'sequelize'

import { env } from '../config'

let sequelize

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(env.PSQL_URI)
} else if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(env.PSQL_URI)
} else if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(env.PSQL_URI)
}

const db = {
  FBAuth: sequelize.import('./FB_Auth'),
  LocalAuth: sequelize.import('./LocalAuth'),
  Todo: sequelize.import('./Todo'),
  User: sequelize.import('./User'),
  VKAuth: sequelize.import('./VK_Auth')
}

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db

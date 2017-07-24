import Sequelize from 'sequelize'

import { env } from '../config'

let sequelize
/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
  // turn logging off here and no more crazy business while testing!
  sequelize = new Sequelize(env.PSQL_URI, { logging: false })
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
  /* istanbul ignore else */
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
// db.Sequelize = Sequelize

export default db

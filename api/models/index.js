import Sequelize from 'sequelize'

let sequelize

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(process.env.PSQL_URI)
} else if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(process.env.PSQL_URI)
} else if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.PSQL_URI)
}

const db = {
  Todo: sequelize.import('./Todo'),
  User: sequelize.import('./User')
}

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
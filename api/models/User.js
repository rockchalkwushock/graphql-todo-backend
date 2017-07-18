export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      // Hey numb nuts this will autoIncrement when using UUID
      // just saying...took you how long to figure this out???
      // NOTE: I can also pass a function here that will return
      // my custom id generating function should I choose to be
      // so savvy...I'm not that savvy.
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // todos: DataTypes.ARRAY(DataTypes.STRING),
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })
  User.associate = models => {
    User.hasMany(models.Todo)
  }
  return User
}

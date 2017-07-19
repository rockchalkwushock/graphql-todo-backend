export default (sequelize, DataTypes) => {
  const Todo = sequelize.define('todo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  })

  Todo.associate = models => {
    // will add userId to Todo Model.
    // I can pass an options object if needed.
    // FOREIGN KEY(userId) REFERENCES users(id)
    Todo.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return Todo
}

export default (sequelize, DataTypes) => {
  const VKAuth = sequelize.define('vk_auth', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })
  VKAuth.associate = models => {
    VKAuth.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return VKAuth
}

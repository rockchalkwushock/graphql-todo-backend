export default (sequelize, DataTypes) => {
  const FBAuth = sequelize.define('fb_auth', {
    id: {
      type: DataTypes.STRING,
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
  FBAuth.associate = models => {
    FBAuth.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return FBAuth
}

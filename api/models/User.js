/**
 * NOTE
 * For more:
 * @see http://docs.sequelizejs.com/manual/tutorial/hooks.html
 * hooks run as follows:
 * - beforeValidate
 * - validate
 * - afterValidate
 * - validationFailed
 * - before(Create|Destroy|Update|Save|Upsert)
 * - create|destroy|update
 * - after(Create|Destroy|Update|Save|Upsert)
 */

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
      // validate: {
      //   // TODO: Create Test Cases.
      //   len: {
      //     args: [6, 16],
      //     msg: 'Username must be between 6 and 16 characters in length.'
      //   }
      // }
    }
  })
  User.associate = models => {
    User.hasMany(models.Todo)
  }
  return User
}

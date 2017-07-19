/* eslint-disable no-param-reassign */
import { hashSync } from 'bcrypt-nodejs'

export default (sequelize, DataTypes) => {
  const LocalAuth = sequelize.define(
    'local_auth',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          // TODO: Create Test Case.
          isEmail: {
            args: true,
            msg: 'You must provide a valid email.'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          // TODO: Create Test Cases.
          isAlphanumeric: {
            args: true,
            msg: 'Password must only include alphanumeric characters.'
          },
          len: {
            args: [8, 21],
            msg: 'Password must be between 8 and 21 characters in length.'
          }
        }
      }
    },
    {
      hooks: {
        // Before creating `this` instance of the model, do something.
        beforeCreate: async ({ dataValues }) => {
          // QUESTION Can I check if the password is being modified/updated?
          // I believe I could do this on beforeUpdate if the user is updating
          // their password. I will need to look into it though.
          dataValues.password = await hashSync(dataValues.password) // NOTE: applies default salt of 10 rounds.
        }
      }
    }
  )
  LocalAuth.associate = models => {
    LocalAuth.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return LocalAuth
}

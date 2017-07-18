/* eslint-disable no-param-reassign */
import { hashSync } from 'bcrypt-nodejs'

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
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        // Hey numb nuts this will autoIncrement when using UUID
        // just saying...took you how long to figure this out???
        // NOTE: I can also pass a function here that will return
        // my custom id generating function should I choose to be
        // so savvy...I'm not that savvy.
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: {
          // TODO: Create Test Cases.
          isUUID: {
            args: 4,
            msg: 'How did you screw this up, it is generated for you???'
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          // TODO: Create Test Cases.
          len: {
            args: [6, 16],
            msg: 'Username must be between 6 and 16 characters in length.'
          }
        }
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
  User.associate = models => {
    User.hasMany(models.Todo)
  }
  return User
}

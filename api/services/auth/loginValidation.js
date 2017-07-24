import { compareSync } from 'bcrypt-nodejs'
import { sign } from 'jsonwebtoken'

/**
 * @func loginValidation
 *
 * @desc Asynchronous method for validating user credentials
 * on login and issuing a jsonwebtoken if request is valid.
 *
 * NOTE: Do not pass sensitive data on the JWT. I only pass
 * the user.id since this value never changes and is all I
 * need to verify the user on the client side of the application.
 *
 * @param {String} email - user submitted email
 * @param {String} password - user submitted password
 * @param {Object} models - object containing Sequelize models.
 * @param {Object} auth - object containing secret & expire time.
 *
 * @returns {String} JWT
 */
export default async (email, password, models, auth) => {
  try {
    const user = await models.LocalAuth.findOne({ where: { email } })
    if (!user) throw new Error('Email not found.')
    const valid = compareSync(password, user.password)
    if (!valid) throw new Error('Incorrect Password')
    const token = sign({ user: user.id }, auth.JWT_SECRET, {
      expiresIn: auth.EXPIRE_TIME
    })
    return token
  } catch (e) {
    throw e
  }
}

/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import passport from 'passport'
import { compareSync } from 'bcrypt-nodejs'
import { sign, verify } from 'jsonwebtoken'

import { env } from '../../config'
import facebookLogin from './FB_Strategy'
import vkontakteLogin from './VK_Strategy'

passport.use(facebookLogin)
passport.use(vkontakteLogin)

export const authFacebook = passport.authenticate('facebook', {
  session: false
})
export const authVkontakte = passport.authenticate('vkontakte', {
  session: false
})

/**
 * @func loginValidation
 *
 * @desc Asynchronous method for validating user credentials
 * on login and issuing a jsonwebtoken if request is valid.
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
export const loginValidation = async (email, password, models, auth) => {
  try {
    const user = await models.LocalAuth.findOne({ where: { email } })
    // TODO: Create Test Case.
    if (!user) throw new Error('Email not found.')
    const valid = compareSync(password, user.password)
    // TODO: Create Test Case.
    if (!valid) throw new Error('Incorrect Password')
    const token = sign({ user: user.id }, auth.JWT_SECRET, {
      expiresIn: auth.EXPIRE_TIME
    })
    return token
  } catch (e) {
    throw e
  }
}

export const addUser = async req => {
  const token = req.headers.authorization
  try {
    const { user } = await verify(token, env.JWT_SECRET)
    req.user = user
  } catch (err) {
    console.log(err)
  }
  req.next()
}

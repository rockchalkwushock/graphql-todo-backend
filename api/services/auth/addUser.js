/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { verify } from 'jsonwebtoken'

import { env } from '../../config'

/**
 * @func addUsers
 *
 * @desc Asynchronous method used as a middleware for validating the user's
 * JWT against the the JWT Secret. If validation is successful user will have
 * access to the auth protected routes in the application.
 *
 * NOTE: This method is to be used server-side ONLY! We are providing the JWT
 * Secret as an argument. We don't want this exposed client-side. Use jwt.decode()
 * for client-side validation and use.
 *
 * @param {Object} - request
 *
 * @returns {Object} - req.user = user data passed in JWT NOTE: (NO-SENSITIVE DATA!)
 */
export default async req => {
  const token = req.headers.authorization
  try {
    const { user } = await verify(token, env.JWT_SECRET)
    req.user = user
  } catch (err) {
    console.log(err)
  }
  req.next()
}

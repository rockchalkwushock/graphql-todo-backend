import passport from 'passport'

import addUser from './addUser'
import loginValidation from './loginValidation'

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

export { addUser, loginValidation }

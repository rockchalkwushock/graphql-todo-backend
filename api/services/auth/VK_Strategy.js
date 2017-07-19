/* eslint-disable camelcase */
import { Strategy as VKontakteStrategy } from 'passport-vkontakte'

import { env } from '../../config'
import models from '../../models'

/**
 * NOTE
 *
 * - params {
 *    access_token: xxx,
 *    expires_in: 1234,
 *    user_id: 123456789
 *  }
 * - profile {
 *    id: 123456789,
 *    username: id123456789,
 *    displayName: Turd Ferguson,
 *    name: { familyName: 'Ferguson', givenName: 'Turd' },
 *    gender: 'male',
 *    profileUrl: 'http://vk.com/id123456789,
 *    photos: [
 *      {
 *        value: 'https://pp.userapi.com/c123456/v123456/sdfadfa/adsfasdfasdfsd.jpg,
 *        type: 'photo'
 *      }
 *    ]
 *  }
 */

export default new VKontakteStrategy(
  {
    clientID: env.VK_APP,
    clientSecret: env.VK_SECRET,
    callbackURL: env.VK_CALLBACK
  },
  async (accessToken, refreshToken, params, profile, done) => {
    try {
      const { id, displayName } = profile
      const vkUsers = await models.VKAuth.findAll({
        limit: 1,
        where: { id }
      })
      if (!vkUsers.length) {
        const user = await models.User.create({
          username: displayName
        })
        await models.VKAuth.create({
          id,
          display_name: displayName,
          user_id: user.id
        })
      }
      done(null, {})
    } catch (e) {
      console.log(e)
      throw new Error('Oops, VK is screwed up!')
    }
  }
)

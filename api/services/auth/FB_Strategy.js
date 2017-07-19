import FacebookStrategy from 'passport-facebook'

/**
 * QUESTION
 * REVIEW
 * FIXME
 * BUG
 *
 * Why is it that:
 *
 * import { env } from '../../config'
 *
 * does not work here?
 *
 * Returns as undefined.
 */
import env from '../../config/environment'
import models from '../../models'

export default new FacebookStrategy(
  {
    clientID: env.FB_APP,
    clientSecret: env.FB_SECRET,
    callbackURL: env.FB_CALLBACK
  },
  async (accessToken, refreshToken, profile, done) => {
    /**
     * Cases
     * 1. First time login
     * 2. All times after first time.
     */
    const { id, displayName, username } = profile
    // Search for user in database via facebook id.
    const fbUsers = await models.FBAuth.findAll({
      limit: 1,
      where: { id }
    })
    // if the array is empty, no user exists at that facebook id.
    if (!fbUsers.length) {
      let user
      // Use the facebook username if available
      // if not use displayName
      if (username !== undefined) {
        user = await models.User.create({ username })
      } else {
        user = await models.User.create({ username: displayName })
      }
      // Just as in LocalAuth, FBAuth depends on the association
      // with User, so User must be created first.
      await models.FBAuth.create({
        id,
        display_name: displayName,
        user_id: user.id
      })
    }
    // Return null & empty object for sessions (not using)
    done(null, {})
  }
)

import Dataloader from 'dataloader'
import _ from 'lodash'

import models from '../models'

const batchUser = async (keys, { User }) => {
  const users = await User.findAll({
    raw: true
  })
}

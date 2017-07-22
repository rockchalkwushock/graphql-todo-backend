import Dataloader from 'dataloader'
import _ from 'lodash'

import models from '../models'

const batchTodos = async (keys, { Todo }) => {
  // keys = [1,2,3 ...]
  const todos = await Todo.findAll({
    raw: true, // no sequelize object just the data.
    where: {
      user_id: {
        $in: keys // check that the 'user_id' is in each key
      }
    }
  })

  // todos = [{text: 'hi', user_id: 1}, {text: 'bye', user_id: 2}, {text: 'your mom' user_id: 3}]
  const gs = _.groupBy(todos, 'user_id')
  // gs = {1: [{text: 'hi', user_id: 1}], 2: [{text: 'bye', user_id: 2}], 3: [{text: 'your mom', user_id: 3}]}
  // in the event there are not todos return and empty array or it will be populated
  // by undefined.
  // Returns and array of arrays
  return keys.map(k => gs[k] || [])
}

const todoLoader = new Dataloader(keys => batchTodos(keys, models))

export default todoLoader

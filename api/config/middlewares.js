import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import expressStatusMonitor from 'express-status-monitor'
import expressWinston from 'express-winston'
import helmet from 'helmet'
import methodOverride from 'method-override'
import morgan from 'morgan'
// import passport from 'passport'

import winstonInstance from './winston'
import { addUser } from '../services'

const isTest = process.env.NODE_ENV === 'test'
const isDev = process.env.NODE_ENV === 'development'

export default app => {
  app.use(compression())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  // app.use(passport.initialize())
  app.use(helmet())
  app.use(cors())
  app.use(expressStatusMonitor())
  app.use(methodOverride())
  if (isDev && !isTest) {
    app.use(morgan('dev'))
    expressWinston.requestWhitelist.push('body')
    expressWinston.responseWhitelist.push('body')
    app.use(
      expressWinston.logger({
        winstonInstance,
        meta: true,
        msg:
          'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true
      })
    )
  }
  /**
   * REVIEW
   *
   * - Rename
   * - Placement?
   */
  app.use(addUser)
}

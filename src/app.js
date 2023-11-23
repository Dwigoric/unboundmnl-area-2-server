// Packages
import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import passport from 'passport'
import 'dotenv/config'

// MongoDB
import database from './db/conn.js'
await database
    .init()
    .then(() => import('./schedules/agenda.js'))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })

// Routes
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import officerRouter from './routes/officers.js'
import loansRouter from './routes/loans.js'
import depositsRouter from './routes/deposits.js'
import settingsRouter from './routes/settings.js'

const app = express()

// Configure CORS
const whitelist = []
if (!process.env.FRONTEND_URLS) console.warn('FRONTEND_URLS not set, allowing all origins')
else whitelist.push(...process.env.FRONTEND_URLS.split(','))
app.use(
    cors({
        origin: whitelist.length === 0 ? true : whitelist,
        optionsSuccessStatus: 200
    })
)

// Initialize authentication
import './auth/auth.js'

// Throw error if JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not set')
    process.exit(1)
}

logger.token('url', (req) => (req.baseUrl || '') + req.path)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))

// Define private static route behind passport
app.all('/private/*', (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        next()
    })(req, res, next)
})
app.use('/private', express.static('private'))

// Define routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/officers', officerRouter)
app.use('/loans', loansRouter)
app.use('/deposits', depositsRouter)
app.use('/settings', settingsRouter)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.send({ message: err.message })
})

export default app

// Default FRONTEND_URL
const DEFAULT_FRONTEND_URL = 'http://localhost:5173'

// Packages
import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import 'dotenv/config'

// MongoDB
import database from './db/conn.js'
await database.init().catch((err) => {
    console.error(err)
    process.exit(1)
})

// Routes
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import officerRoute from './routes/officers.js'

const app = express()

// Configure CORS
if (!process.env.FRONTEND_URL)
    console.warn(`FRONTEND_URL not set, using default: ${DEFAULT_FRONTEND_URL}`)

app.use(
    cors({
        origin: process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL,
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

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/officers', officerRoute)

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

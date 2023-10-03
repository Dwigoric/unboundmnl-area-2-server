// Packages
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
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

const app = express()

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

export default app

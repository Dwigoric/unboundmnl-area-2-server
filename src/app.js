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

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))

app.use('/', indexRouter)
app.use('/users', usersRouter)

export default app

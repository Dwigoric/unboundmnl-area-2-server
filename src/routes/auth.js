import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'

const router = express.Router()

/**
 * POST /login
 *
 * This route authenticates a user by verifying the username and password.
 * After a successful login, a JWT is created and sent back to the client.
 * The username and password are authenticated using the `local` strategy.
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json(info)
        req.login(user, { session: false }, (err) => {
            if (err) return next(err)
            const token = jwt.sign(user, process.env.JWT_SECRET)
            return res.json({ user, token })
        })
    })
})

/**
 * POST /register
 *
 * This route creates a new user and sends back a JWT.
 * The username and password are authenticated using the `register` strategy.
 */
router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json(info)
        req.login(user, { session: false }, (err) => {
            if (err) return next(err)
            const token = jwt.sign(user, process.env.JWT_SECRET)
            return res.json({ user, token })
        })
    })
})

export default router

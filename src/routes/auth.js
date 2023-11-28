/**
 * Express routes for authorization.
 * @module routes/auth
 * @requires express
 */

// Import packages
import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import argon2 from 'argon2'

/**
 * Router to mount routes on.
 * @const
 * @namespace router-auth
 */
const router = express.Router()

// Import models
import LoanOfficer from '../models/loanOfficer.js'

/**
 * POST /login
 *
 * This route authenticates an admin or a loan officer by verifying the username and password.
 * After a successful login, a JWT is created and sent back to the client.
 * The username and password are authenticated using the `local` strategy.
 *
 * @name post/login
 * @function
 * @memberof module:routes/auth~router-auth
 * @inner
 */
router.post('/login', (req, res, next) => {
    const { username } = req.body

    const authStrategy =
        username === 'admin'
            ? passport.authenticate('admin-login', { session: false }, (err, admin, info) => {
                  if (err) return next(err)
                  if (!admin) return res.status(401).json(info)

                  const token = jwt.sign({ uuid: admin.id, type: 'admin' }, process.env.JWT_SECRET)
                  return res.json({ token })
              })
            : passport.authenticate('login', { session: false }, (err, user, info) => {
                  if (err) return next(err)
                  if (!user) return res.status(401).json(info)

                  const token = jwt.sign({ uuid: user.id, type: 'officer' }, process.env.JWT_SECRET)
                  return res.json({ token })
              })

    authStrategy(req, res, next)
})

/**
 * POST /register
 *
 * This route creates a new loan officer.
 * The admin must be logged in to use this route.
 *
 * @name post/register
 * @function
 * @memberof module:routes/auth~router-auth
 * @inner
 */
router.post('/register-officer', (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json(info)

        // Get the loan officer's username, password, name, and role
        const { username, password, name, role } = req.body

        if (password.length > 255) {
            // If the password is too long, send back an error
            return res.status(400).json({ message: 'Password is too long' })
        }

        if (/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(password)) {
            // If the password is weak, send back an error
            return res.status(400).json({ message: 'Password is weak' })
        }

        // Hash the password
        const password_hash = await argon2.hash(password)

        // Create a new loan officer
        try {
            const loanOfficer = await new LoanOfficer({
                username,
                password_hash,
                name,
                role
            }).save()

            // Send back a created status
            return res.status(201).json({ uuid: loanOfficer.id, message: 'Loan officer created' })
        } catch (error) {
            // If there was an error creating the loan officer, send back an error
            if (error.name === 'ValidationError') {
                return res
                    .status(400)
                    .json({ message: error.errors[Object.keys(error.errors)[0]].message })
            }
            console.error(error)
            return next(error)
        }
    })(req, res, next)
})

export default router

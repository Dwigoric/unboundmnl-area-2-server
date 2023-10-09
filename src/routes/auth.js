// Import packages
import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import argon2 from 'argon2'
import { v5 as uuidV5 } from 'uuid'

// Create router
const router = express.Router()

// Import models
import LoanOfficer from '../models/loan_officer.js'

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

        const token = jwt.sign({ username: user.username, name: user.name }, process.env.JWT_SECRET)
        return res.json({ token })
    })
})

/**
 * POST /register
 *
 * This route creates a new loan officer.
 * The admin must be logged in to use this route.
 */
router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, async (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json(info)

        // Get the loan officer's username, password, and name
        const { username, password, name } = req.body

        // Hash the password
        const password_hash = await argon2.hash(password)

        // Create UUID for the loan officer
        const uuid = uuidV5(Date.now().toString(), uuidV5.URL)

        // Create a new loan officer
        await LoanOfficer.create({ username, password_hash, name, uuid }).catch((err) => {
            // If there was an error creating the loan officer, send back an error
            console.error(err)
            return res.status(500).json({ message: 'Error creating loan officer' })
        })

        // Send back a JWT
        const token = jwt.sign({ username, name, uuid }, process.env.JWT_SECRET)
        return res.json({ token })
    })
})

export default router

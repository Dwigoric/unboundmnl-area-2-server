// Import packages
import express from 'express'
import passport from 'passport'

// Import models
import LoanOfficer from '../models/loan_officer.js'

// Create router
const router = express.Router()

/**
 * GET /
 *
 * Get all officers. This route is only accessible to the admin and loan officers.
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const officers = await LoanOfficer.find()

            // Remove sensitive data
            officers.forEach((officer) => delete officer.password_hash)

            res.status(200).json({ officers })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })(req, res, next)
})

/**
 * GET /:id
 *
 * Get officer by UUID. This route is only accessible to the admin and loan officers.
 */
router.get('/:id', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const officer = await LoanOfficer.findOne({ uuid: req.params.id })

            // Remove sensitive data
            delete officer.password_hash

            res.status(200).json({ officer })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })(req, res, next)
})

export default router

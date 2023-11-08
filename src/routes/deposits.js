// Packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import Loanee from '../models/loanee.js'
import Deposit from '../models/deposit.js'

/**
 * GET /:username
 *
 * Get the deposits of a member given their username.
 */
router.get('/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        // Get deposits
        const deposits = await Deposit.find({ username }).lean()

        // Return loans
        return res.status(200).json(deposits)
    })(req, res, next)
})

/**
 * PUT /:username
 *
 * Create a new deposit of a member given their username
 */
router.put('/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        const loanee = await Loanee.findOne({ username }).lean()

        if (!loanee) {
            return res.status(404).json({ message: 'Loanee does not exist' })
        }

        // Create new deposit
        try {
            await Deposit.create({
                username,
                ledger: [],
                status: req.body.status || 'pending'
            })

            // Return deposit status
            return res.status(201).json({ message: 'Deposit created successfully', error: false })
        } catch (err) {
            console.error(err)
        }
    })(req, res, next)
})

export default router

// Import packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import LoanApplication from '../models/loan_application.js'
import Loanee from '../models/loanee.js'

/**
 * GET /:loanee-id
 *
 * Get all loan applications of a loanee
 */
router.get('/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        // Get loanee by UUID
        const loanee = await Loanee.findOne({ username }).lean()

        const loans = await LoanApplication.find({ loanee: loanee._id }).populate('loanee').lean()

        // Return loans
        return res.status(200).json(loans)
    })(req, res, next)
})

/**
 * PUT /:username
 *
 * Create a new loan application for a loanee
 */
router.put('/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        // Get loanee by UUID
        const loanee = await Loanee.findOne({ username }).lean()

        // Create new loan application
        try {
            await LoanApplication.create({
                loanee: loanee._id,
                amount: req.body.amount,
                term: req.body.term,
                new: req.body.new,
                renewal: req.body.renewal,
                type: req.body.type,
                status: req.body.status
            })

            // Return loan application
            return res
                .status(201)
                .json({ message: 'Loan application created successfully', error: false })
        } catch (error) {
            // If there was an error creating the loan officer, send back an error
            console.error(error)
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: error.errors[Object.keys(error.errors)[0]].message,
                    error: true
                })
            }
            return next(error)
        }
    })(req, res, next)
})

export default router

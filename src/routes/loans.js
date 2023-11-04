// Import packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import Loan from '../models/loan.js'
import Loanee from '../models/loanee.js'

/**
 * GET /:loanee-id
 *
 * Get all loan applications of a loanee
 */
router.get('/get/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        // Get loanee by UUID
        const loanee = await Loanee.findOne({ username }).lean()

        const loans = await Loan.find({ username: loanee.username }).populate('loanee').lean()

        // Return loans
        return res.status(200).json(loans)
    })(req, res, next)
})

/**
 * PUT /:username
 *
 * Create a new loan application for a loanee
 */
router.put('/new/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        // Get loanee by UUID
        const loanee = await Loanee.findOne({ username }).lean()

        // Create new loan application
        try {
            await Loan.create({
                loanID: 'not implemented yet',
                username: loanee.username,
                loanType: 'emergency',
                term: req.body.term,
                submissionDate: Date.now(),
                coborrowerName: {
                    given: 'not',
                    last: 'implemented yet'
                },
                originalLoanAmount: req.body.amount,
                ledger: [],
                status: 'pending',
                classification: req.body.classification
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

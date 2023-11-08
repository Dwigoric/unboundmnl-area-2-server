// Import packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import Loan from '../models/loan.js'
import Loanee from '../models/loanee.js'

/**
 * GET /get/:loanee-id
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

        if (!loanee) {
            return res.status(404).json({ message: 'Loanee does not exist' })
        }

        const loans = await Loan.find({ username: loanee.username }).lean()

        // Return loans
        return res.status(200).json(loans)
    })(req, res, next)
})

/**
 * PUT /new/:username
 *
 * Create a new loan application for a loanee
 */
router.put('/new/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        // Get loanee by username
        const loanee = await Loanee.findOne({ username }).lean()

        if (!loanee) {
            return res.status(404).json({ message: 'Loanee does not exist' })
        }

        // Create new loan application
        try {
            await Loan.create({
                username: loanee.username,
                loanType: req.body.type,
                term: req.body.term,
                submissionDate: Date.now(),
                coborrowerName: {
                    given: 'not',
                    last: 'implemented yet'
                },
                originalLoanAmount: req.body.amount,
                ledger: [],
                status: req.body.status,
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

/**
 * POST /review-application
 *
 * Approve or reject a loan application
 *
 *  req.body must be of the form:
 *  {
 *      loanID: String
 *      approved: boolean
 *  }
 */
router.post('/review-application', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const existingLoan = await Loan.findOne({ loanID: req.body.loanID })
            if (!existingLoan) {
                return res.status(400).json({ message: 'Loan application does not exist' })
            } else if (existingLoan.status !== 'pending') {
                return res
                    .status(400)
                    .json({ message: 'Cannot approve an application that is not pending approval' })
            }

            await Loan.updateOne(
                { loanID: req.body.loanID },
                {
                    status: req.body.approved ? 'approved' : 'rejected'
                },
                {
                    runValidators: true
                }
            )

            return res.status(200).json({
                message: `Loan application ${req.body.approved ? 'approved' : 'rejected'}`,
                error: false
            })
        } catch (error) {
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

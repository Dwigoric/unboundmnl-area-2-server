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
router.get('/:loaneeId', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const loaneeId = req.params.loaneeId

        // Get loanee by UUID
        const loanee = await Loanee.findOne({ uuid: loaneeId }).lean()

        const loans = await LoanApplication.find({ loanee: loanee._id }).populate('loanee').lean()

        // Return loans
        return res.status(200).json(loans)
    })(req, res, next)
})

/**
 * POST /:loanee-id
 *
 * Create a new loan application for a loanee
 */
router.post('/:loaneeId', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { loaneeId } = req.params

        // Get loanee by UUID
        const loanee = await Loanee.findOne({ uuid: loaneeId }).lean()

        // Create new loan application
        const loanApplication = new LoanApplication({
            loanee: loanee._id,
            amount: req.body.amount,
            term: req.body.term,
            new: req.body.new,
            renewal: req.body.renewal,
            loan_type: req.body.loan_type,
            status: req.body.status
        })

        // Save loan application
        await loanApplication.save()

        // Return loan application
        return res.status(200).json({ message: 'Loan application created successfully' })
    })(req, res, next)
})

export default router

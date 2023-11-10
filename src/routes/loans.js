// Import packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import Loan from '../models/loan.js'
import Loanee from '../models/loanee.js'

/**
 * GET /
 *
 * Get all loans
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const loans = await Loan.find({ deleted: false }).lean()
        // Remove ledgers and unnecessary fields
        loans.forEach((loan) => {
            delete loan.ledger
            delete loan.deleted
            delete loan.term
            delete loan.submissionDate
            delete loan.approvalDate
            delete loan.coborrowerName

            delete loan.classification
            delete loan.__v
            delete loan._id
        })
        // Return loans
        return res.status(200).json({ loans, error: false })
    })(req, res, next)
})

router.get('/get/:loanid', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        try {
            if (err) return next(err)
            if (!manager) return res.status(401).json(info)

            const loan = await Loan.findOne({ deleted: false, loanID: req.params.loanid }).lean()

            // remove unnecessary fields
            delete loan.classification
            delete loan.__v
            delete loan._id

            // Return loans
            return res.status(200).json({ loan, error: false })
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
            if (
                Object.entries(req.body.coborrowerName).every(([key, val]) => {
                    return val === '' || val === null
                })
            ) {
                req.body.coborrowerName = null
            }

            await Loan.create({
                username: loanee.username,
                loanType: req.body.type,
                term: req.body.term,
                paymentFrequency: req.body.paymentFrequency,
                submissionDate: Date.now(),
                coborrowerName: req.body.coborrowerName,
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
router.post('/review-application/:loanID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const existingLoan = await Loan.findOne({ loanID: req.params.loanID })
            if (!existingLoan) {
                return res.status(404).json({ message: 'Loan application does not exist' })
            } else if (existingLoan.status !== 'pending') {
                return res
                    .status(400)
                    .json({ message: 'Cannot approve an application that is not pending approval' })
            }

            await Loan.updateOne(
                { loanID: req.params.loanID },
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

/**
 * POST /edit-loan
 *
 * Edit a loan or loan application
 *
 * req.body contains the data of the loan to edit. Finds a loan in the database using LoanID.
 * NOTE: Does not edit loan ledgers, loan IDs, or submission dates.
 */
router.post('/edit-loan', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const existingLoan = await Loan.findOne({ loanID: req.body.loanID })
            if (!existingLoan) {
                return res.status(400).json({ message: 'Loan application does not exist' })
            } else {
                // Do not edit loan ledgers, loan IDs, or submission dates.
                let loanInfo = req.body
                if (loanInfo.ledger) {
                    delete loanInfo.ledger
                }
                delete loanInfo.loanID
                delete loanInfo.submissionDate

                if (
                    Object.entries(loanInfo.coborrowerName).every(([key, val]) => {
                        return val === '' || val === null
                    })
                ) {
                    loanInfo.coborrowerName = null
                }

                await Loan.updateOne({ loanID: req.body.loanID }, loanInfo, {
                    runValidators: true
                })

                return res.json({ message: 'Loan application successfully edited', error: false })
            }
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

/**
 * POST /delete-loan
 *
 * Delete a loan or loan application
 *
 * Request body contains; {
 *      loanID: loan ID of the loan to be deleted
 * }
 *
 * This functionality only soft deletes the loan;
 * the deleted loan will still be visible in the database
 */
router.post('/delete-loan', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const existingLoan = await Loan.findOne({ loanID: req.body.loanID })
            if (!existingLoan) {
                return res.status(400).json({ message: 'Loan application does not exist' })
            } else {
                await Loan.updateOne(
                    { loanID: req.body.loanID },
                    {
                        deleted: true
                    }
                )

                return res.json({ message: 'Loan application successfully deleted', error: false })
            }
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

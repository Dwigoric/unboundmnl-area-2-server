// Import packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import Loan from '../models/loan.js'
import Loanee from '../models/loanee.js'

// Ledger routes
import ledgerRouter from './loan-ledgers.js'
router.use(
    '/:loanID/ledger',
    (req, res, next) => {
        req.loanID = req.params.loanID
        next()
    },
    ledgerRouter
)

/**
 * GET /
 *
 * Get all loans
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const options = { deleted: false }
        if (['approved', 'pending', 'rejected'].includes(req.query.status))
            options.status = req.query.status

        const loans = await Loan.find(options)
            .select(
                '-ledger -deleted -term -approvalDate ' +
                    '-coborrowerName -classification -__v -_id'
            )
            .lean()

        // Return loans
        return res.status(200).json({ loans, error: false })
    })(req, res, next)
})

/**
 * GET /get/:loanid
 *
 * Get a loan given its loan ID
 */
router.get('/get/:loanid', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        try {
            if (err) return next(err)
            if (!manager) return res.status(401).json(info)

            const loan = await Loan.findOne({ deleted: false, loanID: req.params.loanid })
                .select('-classification -__v -_id')
                .lean()

            // Return loans
            if (loan) {
                return res.status(200).json({ loan, error: false })
            } else {
                return res.status(400).json({ message: 'Loan ID does not exist', error: true })
            }
        } catch (error) {
            // If there was an error creating the loan officer, send back an error
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: error.errors[Object.keys(error.errors)[0]].message,
                    error: true
                })
            }
            console.error(error)
            return next(error)
        }
    })(req, res, next)
})

/**
 * GET /:username
 *
 * Get all loans for a loanee
 */
router.get('/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        try {
            if (err) return next(err)
            if (!manager) return res.status(401).json(info)

            const { username } = req.params

            const loanee = await Loanee.findOne({ username }).lean()

            if (!loanee) {
                return res.status(404).json({ message: 'Loanee does not exist' })
            }

            const options = { username, deleted: false }
            if (['approved', 'pending', 'rejected'].includes(req.query.status))
                options.status = req.query.status

            const loans = await Loan.find(options).select('-__v -_id').lean()

            // Return loans
            return res.status(200).json({ loans, error: false })
        } catch (error) {
            console.error(error)
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
                Object.entries(req.body.coborrower.name).every(([, val]) => {
                    return val === '' || val === null
                })
            ) {
                req.body.coborrower = null
            }

            await Loan.create({
                username: loanee.username,
                loanType: req.body.type,
                term: req.body.term,
                paymentFrequency: req.body.paymentFrequency,
                submissionDate: Date.now(),
                approvalDate: null,
                coborrower: req.body.coborrower,
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
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: error.errors[Object.keys(error.errors)[0]].message,
                    error: true
                })
            }
            console.error(error)
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
                    $set: {
                        status: req.body.approved ? 'approved' : 'rejected',
                        approvalDate: Date.now()
                    }
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
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: error.errors[Object.keys(error.errors)[0]].message,
                    error: true
                })
            }
            console.error(error)
            return next(error)
        }
    })(req, res, next)
})

/**
 * PATCH /edit-loan
 *
 * Edit a loan or loan application
 *
 * req.body contains the data of the loan to edit. Finds a loan in the database using LoanID.
 * NOTE: Does not edit loan ledgers, loan IDs, submission dates, or approval dates.
 */
router.patch('/edit-loan', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const existingLoan = await Loan.findOne({ loanID: req.body.loanID })
            if (!existingLoan) {
                return res.status(400).json({ message: 'Loan application does not exist' })
            } else {
                // Do not edit loan ledgers, loan IDs, submission dates, or approval dates.
                let loanInfo = { ...req.body }
                if (loanInfo.ledger) {
                    delete loanInfo.ledger
                }
                delete loanInfo.loanID
                delete loanInfo.submissionDate
                delete loanInfo.approvalDate
                delete loanInfo.originalLoanAmount

                if (
                    Object.entries(loanInfo.coborrower.name).every(([, val]) => {
                        return val === '' || val === null
                    })
                ) {
                    loanInfo.coborrower = null
                }

                console.log(loanInfo)
                console.log('body')

                const val = await Loan.updateOne({ loanID: req.body.loanID }, loanInfo, {
                    runValidators: true
                })

                console.log(val)

                return res.json({ message: 'Loan application successfully edited', error: false })
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: error.errors[Object.keys(error.errors)[0]].message,
                    error: true
                })
            }
            console.error(error)
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
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: error.errors[Object.keys(error.errors)[0]].message,
                    error: true
                })
            }
            console.error(error)
            return next(error)
        }
    })(req, res, next)
})
export default router

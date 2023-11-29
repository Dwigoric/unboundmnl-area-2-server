/**
 * Express routes for managing loans.
 * @module routes/loans
 * @requires express
 */

// Import packages
import { Router } from 'express'
import passport from 'passport'
import { Decimal } from 'decimal.js'

import moment from 'moment'
moment().format()

/**
 * Router to mount routes on.
 * @const
 * @namespace router-loans
 */
const router = Router()

// Import models
import Loan from '../models/loan.js'
import Loanee from '../models/loanee.js'
import LoanSettings from '../models/loanSettings.js'

import parseDecimal from '../modules/decimal/parseDecimal.js'

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
 *
 * @name get
 * @function
 * @memberof module:routes/loans~router-loans
 * @inner
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const options = { deleted: false }
        const optionsList = []

        const { status } = req.query
        if (status) {
            const statuses = status.split(',')
            statuses.forEach((s) => {
                if (['pending', 'approved', 'released', 'rejected', 'complete'].includes(s))
                    optionsList.push({ ...options, status: s })
            })
        }

        const loans = await Loan.find(status ? { $or: optionsList } : options)
            .select(
                '-ledger -deleted -term -approvalDate ' +
                    '-coborrowerName -classification -__v -_id'
            )
            .lean()

        parseDecimal(loans)

        // Return loans
        return res.status(200).json({ loans: loans, error: false })
    })(req, res, next)
})

/**
 * GET /:loanID
 *
 * Get a loan given its loan ID
 * @name get
 * @function
 * @memberof module:routes/loans~router-loans
 * @inner
 */
router.get('/:loanID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const loan = await Loan.findOne({ deleted: false, loanID: req.params.loanID })
                .select('-classification -ledger -__v -_id')
                .lean()

            // Return loans
            if (loan) {
                parseDecimal(loan)
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
 * GET /user/:username
 *
 * Get all loans for a loanee given their username
 * @name get/user/:username
 * @function
 * @memberof module:routes/loans~router-loans
 * @inner
 */
router.get('/user/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const { username } = req.params

            const loanee = await Loanee.findOne({ username }).lean()

            if (!loanee) {
                return res.status(404).json({ message: 'Loanee does not exist' })
            }

            const options = { username, deleted: false }
            const optionsList = []

            const { status } = req.query
            const statuses = status.split(',')
            statuses.forEach((s) => {
                if (['pending', 'approved', 'released', 'rejected', 'complete'].includes(s))
                    optionsList.push({ ...options, status: s })
            })

            const loans = await Loan.find({ $or: optionsList }).select('-__v -_id -ledger').lean()

            parseDecimal(loans)
            // Return loans
            return res.status(200).json({ loans, error: false })
        } catch (error) {
            console.error(error)
            return next(error)
        }
    })(req, res, next)
})

/**
 * PUT /user/:username
 *
 * Create a new loan application for a loanee
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name put/user/:username
 * @function
 * @memberof module:routes/loans~router-loans
 * @inner
 */
router.put('/user/:username', async (req, res, next) => {
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
                dueDate: null,
                coborrower: req.body.coborrower,
                originalLoanAmount: req.body.amount,
                balance: req.body.amount,
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
 * POST /:loanID/review
 *
 * Approve or reject a loan application
 *
 *  req.body must be of the form:
 *  {
 *      approved: boolean
 *      oic: {
 *          last:
 *          middle:
 *          first:
 *      }
 *  }
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name post/:loanID/review
 * @function
 * @memberof module:routes/loans~router-loans
 * @inner
 */
router.post('/:loanID/review', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const { loanID } = req.params

            // Fetch and preprocess existing loans
            const existingLoan = await Loan.findOne({ loanID }).lean()
            if (!existingLoan) {
                return res.status(404).json({ message: 'Loan application does not exist' })
            } else if (existingLoan.status !== 'pending') {
                return res
                    .status(400)
                    .json({ message: 'Cannot approve an application that is not pending approval' })
            }
            parseDecimal(existingLoan)

            // Fetch settings
            const settings = await LoanSettings.findOne().lean()

            parseDecimal(settings)

            if (!settings[existingLoan.loanType]) {
                return res.status(400).json({
                    message: 'No loan settings exist for the current loan type',
                    error: true
                })
            }

            // Calculate deductions
            let deductions = new Decimal('0')

            for (const deductionType of ['service_fee', 'capital_build_up', 'savings']) {
                const deductionSetting = settings[existingLoan.loanType][deductionType]

                if (deductionSetting.enabled && deductionSetting.unit === '%') {
                    deductions = deductions.add(
                        new Decimal(deductionSetting.value)
                            .mul(existingLoan.originalLoanAmount)
                            .mul(new Decimal('0.01'))
                    )
                } else if (deductionSetting.enabled) {
                    deductions = deductions.add(deductionSetting.value)
                }
            }

            // Create update query
            const query = {
                $set: {
                    status: req.body.approved ? 'approved' : 'rejected',
                    approvalDate: Date.now()
                }
            }

            if (existingLoan.ledger.length === 0) {
                query.$set.ledger = [
                    {
                        transcationID: Date.now().toString(36).toUpperCase(),
                        transactionDate: Date.now(),
                        submissionDate: Date.now(),
                        amountPaid: deductions,
                        amountDue: 0,
                        balance: deductions.neg().add(existingLoan.balance).toString(),
                        interestPaid: 0,
                        interestDue: 0,
                        finesPaid: 0,
                        finesDue: 0,
                        officerInCharge: req.body.oic
                    }
                ]
            }

            if (existingLoan.balance && req.body.approved) {
                query.$set.balance = deductions.neg().add(existingLoan.balance).toString()
            }

            await Loan.updateOne({ loanID }, query, { runValidators: true })

            return res.status(200).json({
                message: `Loan application ${req.body.approved ? 'approved' : 'rejected'}`,
                error: false
            })
        } catch (error) {
            if (error.name === 'ValidationError') {
                if (error.errors.balance) {
                    return res.status(400).json({
                        message:
                            'Cannot accept loan: Loan balance would be less than 0 after initial deductions',
                        error: true
                    })
                }

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
 * PATCH /:loanID
 *
 * Edit a loan or loan application
 *
 * req.body contains the data of the loan to edit. Finds a loan in the database using LoanID.
 * NOTE: Does not edit loan ledgers, loan IDs, submission dates, or approval dates.
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name patch/:loanID
 * @function
 * @memberof module:routes/loans~router-loans
 * @inner
 */
router.patch('/:loanID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const { loanID } = req.params

            const existingLoan = await Loan.findOne({ loanID })
            if (!existingLoan)
                return res.status(404).json({ message: 'Loan application does not exist' })

            // Do not edit loan ledgers, loan IDs, submission dates, or approval dates.
            const loanInfo = { ...req.body }
            if (loanInfo.ledger) {
                delete loanInfo.ledger
            }
            delete loanInfo.loanID
            delete loanInfo.submissionDate
            delete loanInfo.approvalDate
            delete loanInfo.originalLoanAmount

            const response = { message: 'Loan application successfully edited', error: false }

            if (existingLoan.status === 'approved' && loanInfo.status === 'released') {
                loanInfo.releaseDate = new Date()

                loanInfo.dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24)
                if (existingLoan.paymentFrequency === 'weekly')
                    loanInfo.dueDate.setDate(loanInfo.dueDate.getDate() + 6)
                else if (existingLoan.paymentFrequency === 'months') {
                    loanInfo.dueDate.setMonth(loanInfo.dueDate.getMonth() + 1)
                    loanInfo.dueDate.setDate(loanInfo.dueDate.getDate() - 1)
                }

                const settings = await LoanSettings.findOne().lean()
                parseDecimal(settings)

                if (!settings[existingLoan.loanType]) {
                    return res.status(400).json({
                        message: 'No loan settings exist for the current loan type',
                        error: true
                    })
                }

                const timeSetting = settings[existingLoan.loanType].time
                const timeConversions = {
                    days: 1,
                    months: 30,
                    years: 365
                }
                loanInfo.nextInterestDate = moment(loanInfo.releaseDate)
                    .add(timeSetting.value * timeConversions[timeSetting.type], 'days')
                    .set({
                        hour: 0,
                        minute: 0,
                        second: 0,
                        millisecond: 0
                    })
                    .toDate()

                response.dueDate = loanInfo.dueDate
            }

            if (
                loanInfo.coborrower &&
                Object.entries(loanInfo.coborrower.name).every(([, val]) => {
                    return val === '' || val === null
                })
            ) {
                loanInfo.coborrower = null
            }

            await Loan.updateOne({ loanID }, loanInfo, { runValidators: true })

            return res.status(200).json(response)
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
 * DELETE /:loanID
 *
 * Delete a loan or loan application
 *
 * This functionality only soft deletes the loan;
 * the deleted loan will still be visible in the database
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name delete/:loanID
 * @function
 * @memberof module:routes/loans~router-loans
 * @inner
 */
router.delete('/:loanID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const { loanID } = req.params

            const existingLoan = await Loan.findOne({ loanID })
            if (!existingLoan) {
                return res.status(404).json({ message: 'Loan application does not exist' })
            } else {
                await Loan.updateOne({ loanID }, { deleted: true })

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

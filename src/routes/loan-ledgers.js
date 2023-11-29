/**
 * Express routes for managing loan ledgers.
 * @module routes/loan-ledgers
 * @requires express
 */

// Packages
import { Router } from 'express'
import passport from 'passport'

/**
 * Router to mount routes on. Accessed through {SERVER_URL}/loans/{loan_id}/ledger/{route},
 * where loan_id is the ID of the loan whose ledger is being accessed.
 * @const
 * @namespace router-loan-ledgers
 */
const router = Router()

// Models
import Loan from '../models/loan.js'

import parseDecimal from '../modules/decimal/parseDecimal.js'

/**
 * GET /
 *
 * Get all loan ledgers
 *
 * @name get
 * @function
 * @memberof module:routes/loan-ledgers~router-loan-ledgers
 * @inner
 */
router.get('/', (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        // Return the ledger of given loan (from params)
        const { loanID } = req

        const loan = await Loan.findOne({ deleted: false, loanID }).lean()

        if (!loan) return res.status(404).json({ error: true, message: 'Loan not found' })

        const { ledger } = loan

        parseDecimal(ledger)

        return res.status(200).json({ ledger, error: false })
    })(req, res, next)
})

/**
 * GET /:txID
 *
 * Get information of a transaction
 *
 * @name get/:txID
 * @function
 * @memberof module:routes/loan-ledgers~router-loan-ledgers
 * @inner
 */
router.get('/:txID', (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        // Return information of the transaction
        const { loanID } = req
        const { txID } = req.params

        // Retrieve loan
        const loan = await Loan.findOne({ deleted: false, loanID }).lean()

        if (!loan) return res.status(404).json({ error: true, message: 'Loan not found' })

        const { ledger } = loan

        // Find transaction
        const transaction = ledger.find((tx) => tx.transactionID === txID)

        if (!transaction) {
            parseDecimal(transaction)
            return res.status(404).json({ error: true, message: 'Transaction not found' })
        }

        // Return transaction
        return res.status(200).json({ transaction, error: false })
    })(req, res, next)
})

/**
 * PUT /
 *
 * Create a new transaction
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name put
 * @function
 * @memberof module:routes/loan-ledgers~router-loan-ledgers
 * @inner
 */
router.put('/', (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        // Return the ledger of given loan (from params)
        const { loanID } = req

        const loan = await Loan.findOne({ deleted: false, loanID }).lean()

        if (!loan) return res.status(404).json({ error: true, message: 'Loan not found' })

        // Construct transaction info
        const transactionInfo = {
            ...req.body,
            transactionID: Date.now().toString(36).toUpperCase()
        }

        const query = {
            $push: { ledger: transactionInfo },
            $set: {}
        }

        // Determine if transaction is payment, and mark as paid if so
        if (transactionInfo.transactionType === 'payment') {
            query.$set = { ...query.$set, isPaidForCurrentPeriod: true }
        }

        // Update balance depending on whether transaction is readjustment or not
        if (loan.balance) {
            query.$set = { ...query.$set, balance: req.body.balance }
        }

        try {
            // Add transaction to ledger
            await Loan.updateOne({ deleted: false, loanID }, query, {
                runValidators: true
            })

            // Return a 200 response
            return res.status(200).json({
                error: false,
                message: 'Transaction successfully added',
                transactionID: transactionInfo.transactionID
            })
        } catch (error) {
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
 * PATCH /:txID
 *
 * Update a transaction
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name patch/:txID
 * @function
 * @memberof module:routes/loan-ledgers~router-loan-ledgers
 * @inner
 */
router.patch('/:txID', (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        // Return information of the transaction
        const { loanID } = req
        const { txID } = req.params

        // Retrieve loan
        const loan = await Loan.findOne({ deleted: false, loanID }).lean()

        if (!loan) return res.status(404).json({ error: true, message: 'Loan not found' })

        const { ledger } = loan

        // Find transaction
        const transaction = ledger.find((tx) => tx.transactionID === txID)

        if (!transaction)
            return res.status(404).json({ error: true, message: 'Transaction not found' })

        const query = {
            'ledger.$.ORNumber': req.body.ORNumber,
            'ledger.$.transactionDate': req.body.transactionDate,
            'ledger.$.submissionDate': req.body.submissionDate,
            'ledger.$.amountPaid': req.body.amountPaid,
            'ledger.$.balance': req.body.balance,
            'ledger.$.interestPaid': req.body.interestPaid,
            'ledger.$.finesPaid': req.body.finesPaid
        }
        if (req.body.officerInCharge) {
            Object.assign(query, {
                'ledger.$.officerInCharge.given': req.body.officerInCharge.given,
                'ledger.$.officerInCharge.middle': req.body.officerInCharge.middle,
                'ledger.$.officerInCharge.last': req.body.officerInCharge.last
            })
        }

        try {
            // Update transaction
            await Loan.updateOne(
                { deleted: false, loanID, 'ledger.transactionID': txID },
                { $set: query }
            )

            // Return a 200 response
            return res
                .status(200)
                .json({ error: false, message: 'Transaction information successfully edited' })
        } catch (error) {
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

// Packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Models
import Loan from '../models/loan.js'

// Routes
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
            return res.status(200).json({ error: false, message: 'Transaction successfully added' })
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

// Helper functions
// https://stackoverflow.com/questions/53369688/extract-decimal-from-decimal128-with-mongoose-mongodb
const parseDecimal = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
        if (v.constructor.name === 'Decimal128') prev[i] = parseFloat(v)
        else
            Object.entries(v).forEach(([key, value]) =>
                parseDecimal(value, key, prev ? prev[i] : v)
            )
    }
}

export default router

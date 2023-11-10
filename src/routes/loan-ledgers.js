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

        if (!transaction)
            return res.status(404).json({ error: true, message: 'Transaction not found' })

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

        const { ledger } = loan

        // Add transaction to ledger
        ledger.push(req.body)

        try {
            // Update loan
            await Loan.updateOne({ deleted: false, loanID }, { $set: { ledger } })

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

        try {
            // Update transaction
            await Loan.updateOne(
                { deleted: false, loanID, 'ledger.transactionID': txID },
                { $set: { 'ledger.$': req.body } }
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

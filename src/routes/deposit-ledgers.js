// Packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Models
import Deposit from '../models/deposit.js'

// Routes

/**
 * GET /
 *
 * Get all deposits
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { depositID } = req

        const deposit = await Deposit.find({ deleted: false, depositID }).select('-__v -_id').lean()

        if (!deposit) return res.status(404).json({ error: true, message: 'Deposit not found' })

        const { ledger } = deposit
        return res.status(200).json({ ledger, error: false })
    })(req, res, next)
})

/**
 * GET /:txID
 *
 * Get information of a transaction
 */
router.get('/:txID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { depositID } = req
        const { txID } = req.params

        // Retrieve deposit
        const deposit = await Deposit.findOne({ deleted: false, depositID }).lean()

        if (!deposit) return res.status(404).json({ error: true, message: 'Deposit not found' })

        const { ledger } = deposit

        // Find transaction
        const transaction = ledger.find((tx) => tx.transactionID === txID)

        if (!transaction)
            return res.status(404).json({ error: true, message: 'Transaction not found' })

        // Return transaction
        return res.status(200).json({ transaction, error: false })
    })(req, res, next)
})

/**
 * PUT /
 *
 * Create a new transaction
 */
router.put('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { depositID } = req

        // Retrieve deposit
        const deposit = await Deposit.findOne({ deleted: false, depositID }).lean()

        if (!deposit) return res.status(404).json({ error: true, message: 'Deposit not found' })

        const { ledger } = deposit

        // Add transaction to ledger
        ledger.push(req.body)

        try {
            // Update deposit
            await Deposit.updateOne({ deleted: false, depositID }, { $set: { ledger } })

            // Return transaction
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

/**
 * PATCH /:txID
 *
 * Update a transaction
 */
router.patch('/:txID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { depositID } = req
        const { txID } = req.params

        // Retrieve deposit
        const deposit = await Deposit.findOne({ deleted: false, depositID }).lean()

        if (!deposit) return res.status(404).json({ error: true, message: 'Deposit not found' })

        const { ledger } = deposit

        // Find transaction
        const transaction = ledger.find((tx) => tx.transactionID === txID)

        if (!transaction)
            return res.status(404).json({ error: true, message: 'Transaction not found' })

        const query = {
            'ledger.$.ORNumber': req.body.ORNumber,
            'ledger.$.transactionDate': req.body.transactionDate,
            'ledger.$.amountReceived': req.body.amountReceived,
            'ledger.$.amountWithdrawn': req.body.amountWithdrawn,
            'ledger.$.interest': req.body.interest,
            'ledger.$.balance': req.body.balance
        }

        try {
            // Update deposit
            await Deposit.updateOne(
                { deleted: false, depositID, 'ledger.transactionID': txID },
                { $set: query }
            )

            // Return transaction
            return res
                .status(200)
                .json({ error: false, message: 'Transaction successfully updated' })
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

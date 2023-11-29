/**
 * Express routes for managing deposit ledgers.
 * @module routes/deposit-ledgers
 * @requires express
 */

// Packages
import { Router } from 'express'
import passport from 'passport'

/**
 * Router to mount routes on. Accessed through {SERVER_URL}/deposits/{deposit_id}/ledger/{route},
 * where deposit_id is the Deposit ID of the deposit whose ledger is being accessed.
 * @const
 * @namespace router-deposit-ledgers
 */
const router = Router()

// Models
import Deposit from '../models/deposit.js'

import parseDecimal from '../modules/decimal/parseDecimal.js'

// Routes

/**
 * GET /
 *
 * Get all deposit ledgers from the current deposit.
 *
 * @name get
 * @function
 * @memberof module:routes/deposit-ledgers~router-deposit-ledgers
 * @inner
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { depositID } = req

        const deposit = await Deposit.findOne({ deleted: false, depositID })
            .select('-__v -_id')
            .lean()

        if (!deposit) return res.status(404).json({ error: true, message: 'Deposit not found' })

        const { ledger } = deposit

        parseDecimal(ledger)
        return res.status(200).json({ ledger, error: false })
    })(req, res, next)
})

/**
 * GET /:txID
 *
 * Get information of a particular transaction from this deposit.
 * txID is the transaction ID of the deposit.
 *
 * @name get/:txID
 * @function
 * @memberof module:routes/deposit-ledgers~router-deposit-ledgers
 * @inner
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

        parseDecimal(transaction)

        // Return transaction
        return res.status(200).json({ transaction, error: false })
    })(req, res, next)
})

/**
 * PUT /
 *
 * Create a new transaction under this deposit. req.body must be a valid document following the .
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name put
 * @function
 * @memberof module:routes/deposit-ledgers~router-deposit-ledgers
 * @inner
 */
router.put('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { depositID } = req

        // Retrieve deposit
        const deposit = await Deposit.findOne({ deleted: false, depositID }).lean()

        if (!deposit) return res.status(404).json({ error: true, message: 'Deposit not found' })

        // Construct transaction info
        const transactionInfo = {
            ...req.body,
            transactionID: Date.now().toString(36).toUpperCase()
        }

        try {
            // Add transaction to ledger
            await Deposit.updateOne(
                { deleted: false, depositID },
                {
                    $push: { ledger: transactionInfo },
                    $set: { runningAmount: req.body.balance }
                }
            )

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
 * Update a transaction.
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name patch/:txID
 * @function
 * @memberof module:routes/deposit-ledgers~router-deposit-ledgers
 * @inner
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
            'ledger.$.submissionDate': req.body.submissionDate,
            'ledger.$.depositType': req.body.depositType,
            'ledger.$.amount': req.body.amount,
            'ledger.$.interest': req.body.interest,
            'ledger.$.balance': req.body.balance
        }
        if (req.body.officerInCharge) {
            Object.assign(query, {
                'ledger.$.officerInCharge.given': req.body.officerInCharge.given,
                'ledger.$.officerInCharge.middle': req.body.officerInCharge.middle,
                'ledger.$.officerInCharge.last': req.body.officerInCharge.last
            })
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

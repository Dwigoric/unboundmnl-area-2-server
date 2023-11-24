// Packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import Loanee from '../models/loanee.js'
import Deposit from '../models/deposit.js'

// Ledger routes
import ledgerRouter from './deposit-ledgers.js'
router.use(
    '/:depositID/ledger',
    (req, res, next) => {
        req.depositID = req.params.depositID
        next()
    },
    ledgerRouter
)

/**
 * GET /
 *
 * Get all deposits
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const deposits = await Deposit.find({ deleted: false }).select('-__v -_id').lean()

        parseDecimal(deposits)

        return res.status(200).json({ deposits, error: false })
    })(req, res, next)
})

/**
 * GET /get/:depositid
 *
 * Get a deposit given its deposit ID
 */
router.get('/:depositID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const deposit = await Deposit.findOne({ deleted: false, depositID: req.params.depositID })
            .select('-__v -_id')
            .lean()

        if (deposit) {
            parseDecimal(deposit)
            return res.status(200).json({ deposit, error: false })
        } else {
            return res.status(400).json({ message: 'Deposit ID does not exist', error: true })
        }
    })(req, res, next)
})

/**
 * GET /:username
 *
 * Get all deposits of a member given their username
 */
router.get('/user/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        try {
            if (err) return next(err)
            if (!manager) return res.status(401).json(info)

            const { username } = req.params

            const loanee = await Loanee.findOne({ username }).lean()

            if (!loanee) {
                return res.status(404).json({ message: 'Loanee does not exist' })
            }

            const deposits = await Deposit.find({ username, deleted: false })
                .select('-__v -_id')
                .lean()

            parseDecimal(deposits)

            return res.status(200).json({ deposits, error: false })
        } catch (error) {
            console.error(error)
            return next(error)
        }
    })(req, res, next)
})

/**
 * PUT /:username
 *
 * Create a new deposit of a member given their username
 *
 * req.body is of the format {
 *      username
 *      approvalDate,
 *      status (optional),
 *      category,
 *      interest rate,
 *      original deposit amount
 * }
 */
router.put('/user/:username', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const { username } = req.params

        const loanee = await Loanee.findOne({ username }).lean()

        if (!loanee) {
            return res.status(404).json({ message: 'Loanee does not exist' })
        }

        // Create new deposit
        try {
            await Deposit.create({
                username: username,
                approvalDate: req.body.approvalDate,
                category: req.body.category,
                interestRate: req.body.interestRate,
                originalDepositAmount: req.body.originalDepositAmount,
                runningAmount: req.body.originalDepositAmount,
                ledger: [],
                status: req.body.status || 'pending'
            })

            // Return deposit status
            return res.status(201).json({ message: 'Deposit created successfully', error: false })
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
 * PATCH /:depositID
 *
 * Edit a deposit
 *
 * req.body contains the data of the deposit to edit. Finds a deposit in the database using depositID.
 * NOTE: Does not edit deposit IDs.
 */
router.patch('/:depositID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const { depositID } = req.params

            const existingDeposit = await Deposit.findOne({ depositID })
            if (!existingDeposit) {
                return res.status(400).json({ message: 'Deposit application does not exist' })
            } else {
                let depositInfo = req.body
                if (depositInfo.ledger) {
                    delete depositInfo.ledger
                }

                delete depositInfo.depositID
                delete depositInfo.approvalDate

                await Deposit.updateOne({ depositID }, depositInfo, { runValidators: true })

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
 * DELETE /:depositID
 *
 * Delete a deposit.
 *
 * This functionality only soft deletes the deposit.
 */
router.delete('/:depositID', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const { depositID } = req.params

            const existingDeposit = await Deposit.findOne({ depositID })
            if (!existingDeposit) {
                return res.status(404).json({ message: 'Deposit does not exist' })
            } else {
                await Deposit.updateOne(
                    { depositID },
                    {
                        deleted: true
                    }
                )

                return res.json({
                    message: 'Deposit application successfully deleted',
                    error: false
                })
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

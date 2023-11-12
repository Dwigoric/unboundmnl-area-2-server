// Packages
import { Router } from 'express'
import passport from 'passport'

// Initialize router
const router = Router()

// Import models
import Loanee from '../models/loanee.js'
import Deposit from '../models/deposit.js'

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

        return res.status(200).json({ deposits, error: false })
    })(req, res, next)
})

router.get('/get/:depositid', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        const deposit = await Deposit.findOne({ deleted: false, depositID: req.params.depositid })
            .select('-__v -_id')
            .lean()

        if (deposit) {
            return res.status(200).json({ deposit, error: false })
        } else {
            return res.status(400).json({ message: 'Deposit ID does not exist', error: true })
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
router.put('/new/:username', async (req, res, next) => {
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
                ledger: [],
                status: req.body.status || 'pending'
            })

            // Return deposit status
            return res.status(201).json({ message: 'Deposit created successfully', error: false })
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
 * POST /edit-deposit
 *
 * Edit a deposit
 *
 * req.body contains the data of the deposit to edit. Finds a deposit in the database using depositID.
 * NOTE: Does not edit deposit IDs.
 */
router.post('/edit-deposit', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const existingDeposit = await Deposit.findOne({ depositID: req.body.depositID })
            if (!existingDeposit) {
                return res.status(400).json({ message: 'Deposit application does not exist' })
            } else {
                let depositInfo = req.body
                if (depositInfo.ledger) {
                    delete depositInfo.ledger
                }

                delete depositInfo.depositID
                delete depositInfo.approvalDate

                await Deposit.updateOne({ loanID: req.body.loanID }, depositInfo, {
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
 * POST /delete-deposit
 *
 * Delete a deposit.
 *
 * Request body contains: {
 *      depositID: deposit ID of the deposit to be deleted
 * }
 *
 * This functionality only soft deletes the deposit.
 */
router.post('/delete-deposit', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const existingDeposit = await Deposit.findOne({ depositID: req.body.depositID })
            if (!existingDeposit) {
                return res.status(400).json({ message: 'Deposit does not exist' })
            } else {
                await Deposit.updateOne(
                    { DepositID: req.body.DepositID },
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

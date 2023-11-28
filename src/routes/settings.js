// Packages
import { Router } from 'express'
import passport from 'passport'

// Schema
import LoanSettings from '../models/loanSettings.js'
import DepositSettings from '../models/depositSettings.js'
import NotificationSettings from '../models/notificationSettings.js'

// Initialize router
const router = Router()

// Routes for Loans
router.get('/loans', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json({ message: info.message })

        const settings = await LoanSettings.findOne().select('-_id -__v').lean()

        parseDecimal(settings)

        return res.status(200).json({ settings })
    })(req, res, next)
})

router.patch('/loans/:loanType', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json({ message: info.message })

        try {
            const query = {}
            query[req.params.loanType] = req.body

            await LoanSettings.findOneAndUpdate({}, query).select('-_id -__v')

            return res.status(200).json({ error: false, message: 'Updated loan settings' })
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

// Routes for Deposits
router.get('/deposits', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json({ message: info.message })

        const settings = await DepositSettings.findOne().select('-_id -__v').lean()

        parseDecimal(settings)

        return res.status(200).json({ settings })
    })(req, res, next)
})

router.patch('/deposits/:depositType', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json({ message: info.message })

        try {
            const query = {}
            query[req.params.depositType] = req.body

            await DepositSettings.findOneAndUpdate({}, query).select('-_id -__v')

            return res.status(200).json({ error: false, message: 'Updated deposit settings' })
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

// Routes for Notifications
router.get('/notifications', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json({ message: info.message })

        const settings = await NotificationSettings.findOne().select('-_id -__v').lean()

        parseDecimal(settings)

        return res.status(200).json({ settings })
    })(req, res, next)
})

router.patch('/notifications', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json({ message: info.message })

        try {
            await NotificationSettings.findOneAndUpdate({}, req.body).select('-_id -__v')

            return res.status(200).json({ error: false, message: 'Updated deposit settings' })
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

// https://stackoverflow.com/questions/53369688/extract-decimal-from-decimal128-with-mongoose-mongodb
const parseDecimal = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
        if (v.constructor.name === 'Decimal128') prev[i] = parseFloat(v.toString())
        else
            Object.entries(v).forEach(([key, value]) =>
                parseDecimal(value, key, prev ? prev[i] : v)
            )
    }
}

export default router

// Packages
import { Router } from 'express'
import passport from 'passport'

// Schema
import LoanSettings from '../models/loan_settings.js'
import DepositSettings from '../models/deposit_settings.js'

// Initialize router
const router = Router()

// Routes for Loans
router.get('/loans', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json({ message: info.message })

        const settings = await LoanSettings.findOne().select('-_id -__v')

        return res.status(200).json({ settings })
    })(req, res, next)
})

router.patch('/loans', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json({ message: info.message })

        try {
            await LoanSettings.findOneAndUpdate({}, req.body).select('-_id -__v')

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

        const settings = await DepositSettings.findOne().select('-_id -__v')

        return res.status(200).json({ settings })
    })(req, res, next)
})

router.patch('/deposits', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json({ message: info.message })

        try {
            await DepositSettings.findOneAndUpdate({}, req.body).select('-_id -__v')

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

export default router

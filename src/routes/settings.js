/**
 * Express routes for managing settings.
 * @module routes/settings
 * @requires express
 */

// Packages
import { Router } from 'express'
import passport from 'passport'

// Schema
import LoanSettings from '../models/loanSettings.js'
import DepositSettings from '../models/depositSettings.js'
import NotificationSettings from '../models/notificationSettings.js'

import parseDecimal from '../modules/conversions/parseDecimal.js'

/**
 * Router to mount routes on.
 * @const
 * @namespace router-settings
 */
const router = Router()

/**
 * GET /loans
 *
 * Get all loan-related settings
 *
 * @name get/loans
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 */
router.get('/loans', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json({ message: info.message })

        const settings = await LoanSettings.findOne().select('-_id -__v').lean()

        parseDecimal(settings)

        return res.status(200).json({ settings })
    })(req, res, next)
})

/**
 * PATCH /loans/:loanType
 *
 * Edit the settings of a given loan type
 *
 * @name patch/loans/:loanType
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 */
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

/**
 * GET /deposits
 *
 * Get all deposit-related settings
 *
 * @name get/deposits
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 */
router.get('/deposits', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json({ message: info.message })

        const settings = await DepositSettings.findOne().select('-_id -__v').lean()

        parseDecimal(settings)

        return res.status(200).json({ settings })
    })(req, res, next)
})

/**
 * PATCH /deposits/:depositType
 *
 * Edit the settings of a given deposit type
 *
 * @name patch/deposits/:depositType
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 */
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
/**
 * GET /notifications
 *
 * Get all notification-related settings
 *
 * @name get/notifications
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 */
router.get('/notifications', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json({ message: info.message })

        const settings = await NotificationSettings.findOne().select('-_id -__v').lean()

        parseDecimal(settings)

        return res.status(200).json({ settings })
    })(req, res, next)
})

/**
 * PATCH /notifications
 *
 * Edit the notification settings
 *
 * @name patch/notifications
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 */
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

export default router

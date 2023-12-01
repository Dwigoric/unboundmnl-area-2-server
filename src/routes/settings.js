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

import parseDecimal from '../modules/decimal/parseDecimal.js'

/**
 * Router to mount routes on. Accessed through {SERVER_URL}/settings/{route}
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
 * Edit the settings of a given loan type.
 *
 * loanType is the loan type whose settings should be edited.
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name patch/loans/:loanType
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 *
 * @param {MandatoryIndividualSettingSchema} interest_rate -The interest rate of the current loan type. Used for automatic interest calculations.
 * @param {IndividualSettingSchema} service_fee - Initial service fees for the current loan type. Deducted from the loan value upon loan approval.
 * @param {IndividualSettingSchema} capital_build_up - Capital build-up fee for the current loan type. Deducted from the loan value upon loan approval.
 * @param {IndividualSettingSchema} savings - Savings contribution for the current loan type. Deducted from the loan value upon loan approval.
 * @param {TimeSettingSchema} time - Time period between interest applications.
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
 * depositType is the deposit type whose settings should be edited.
 *
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name patch/deposits/:depositType
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 *
 * @param {MandatoryIndividualSettingSchema} interest_rate - Interest rate of the deposit type.
 * @param {TimeSettingSchema} time - Time period between interest applications.
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
 * Request body must be a JSON object containing the fields specified in the `parameters` section.
 *
 * @name patch/notifications
 * @function
 * @memberof module:routes/settings~router-settings
 * @inner
 *
 * @param {Number} reminder - How close to the deadline a loan has to be for it to warrant a reminder.
 * @param {Number} first_notice - How close to the deadline a loan has to be for it to warrant a first notice.
 * @param {Number} second_notice - How close to the deadline a loan has to be for it to warrant a second notice.
 * @param {Number} third_notice - How close to the deadline a loan has to be for it to warrant a third notice.
 * @param {Number} demand_letter - How close to the deadline a loan has to be for it to warrant a demand letter.
 */
router.patch('/notifications', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json({ message: info.message })

        if (
            req.body.demand_letter >= req.body.third_notice ||
            req.body.third_notice >= req.body.second_notice ||
            req.body.second_notice >= req.body.first_notice ||
            req.body.first_notice >= req.body.reminder
        )
            return res.status(400).json({
                message: 'The order of the notifications is not correct',
                error: true
            })

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

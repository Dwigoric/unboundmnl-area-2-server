// Import packages
import express from 'express'
import passport from 'passport'
import argon2 from 'argon2'

// Import models
import LoanOfficer from '../models/loan_officer.js'
import Admin from '../models/admin.js'

// Create router
const router = express.Router()

/**
 * GET /
 *
 * Get all officers. This route is only accessible to the admin and loan officers.
 */
router.get('/', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const officers = await LoanOfficer.find()
                .select('-password_hash -_id -__v -name._id')
                .lean()

            res.status(200).json({ officers })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })(req, res, next)
})

/**
 * GET /:id
 *
 * Get officer by UUID. This route is only accessible to the admin and loan officers.
 */
router.get('/:id', async (req, res, next) => {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const admin = await Admin.findOne({ username: 'admin' }).lean()

            // Compare UUID to determine if admin or loan officer
            let officer = admin
            if (admin.id !== req.params.id)
                officer = await LoanOfficer.findOne({ id: req.params.id }).lean()

            // Remove sensitive data
            delete officer.password_hash
            delete officer._id
            delete officer.__v

            res.status(200).json({ officer })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })(req, res, next)
})

/**
 * PATCH /admin/password
 *
 * Update admin's password. This route is only accessible to the admin.
 */
router.patch('/admin/password', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json(info)

        // Validate password
        const { password } = req.body
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' })
        }

        const password_hash = await argon2.hash(password)

        try {
            await Admin.updateOne({ username: 'admin' }, { password_hash })
            res.status(200).json({ message: 'Admin password updated' })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })(req, res, next)
})

/**
 * PATCH /:id/password
 *
 * Update officer's password by UUID. This route is only accessible to the admin.
 */
router.patch('/:id/password', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json(info)

        const officer = await LoanOfficer.findOne({ id: req.params.id }).lean()
        if (!officer) return res.status(404).json({ message: 'Loan officer not found' })

        // Validate password
        const { password } = req.body
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' })
        }

        const password_hash = await argon2.hash(password)

        try {
            await LoanOfficer.updateOne({ id: req.params.id }, { password_hash })
            res.status(200).json({ message: 'Loan officer password updated' })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })(req, res, next)
})

/**
 * DELETE /:id
 *
 * Mark officer as inactive by UUID. This route is only accessible to the admin.
 */
router.delete('/:id', async (req, res, next) => {
    passport.authenticate('admin', { session: false }, async (err, admin, info) => {
        if (err) return next(err)
        if (!admin) return res.status(401).json(info)

        const officer = await LoanOfficer.findOne({ id: req.params.id }).lean()
        if (!officer) return res.status(404).json({ message: 'Loan officer not found' })

        try {
            await LoanOfficer.updateOne({ id: req.params.id }, { active: false })
            res.status(200).json({ message: 'Loan officer marked inactive' })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })(req, res, next)
})

export default router

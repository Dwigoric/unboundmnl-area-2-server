/**
 * Express routes for managing users.
 * @module routes/users
 * @requires express
 */

// Packages
import express from 'express'
import passport from 'passport'

/**
 * Router to mount routes on.
 * @const
 * @namespace router-users
 */
const router = express.Router()

// Methods
function empty(obj) {
    return Object.entries(obj).every(([key, val]) => {
        return (
            key === '_id' || val === '' || val === null || (typeof val === 'object' && empty(val))
        )
    })
}

// Schema
import Loanee from '../models/loanee.js'

/**
 * GET users listing.
 * @name get
 * @function
 * @memberof module:routes/users~router-users
 * @inner
 */
router.get('/', async function (req, res, next) {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const loanees = await Loanee.find()
                .select('-_id -name._id -spouse._id -spouse.name._id')
                .lean()

            return res.json(loanees)
        } catch (e) {
            return next(e)
        }
    })(req, res, next)
})

/**
 * Search the users listing by username
 * @name get/search
 * @function
 * @memberof module:routes/users~router-users
 * @inner
 */
router.get('/search', async function (req, res, next) {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const loanees = await Loanee.find({ $text: { $search: req.query.username } })
                .select('-_id -name._id -spouse._id -spouse.name._id')
                .lean()

            return res.json(loanees)
        } catch (e) {
            return next(e)
        }
    })(req, res, next)
})

/**
 * Add a new user to the users listing.
 * @name post/add
 * @function
 * @memberof module:routes/users~router-users
 * @inner
 */
router.put('/', async function (req, res, next) {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const username = req.body.username
            const existingLoanee = await Loanee.findOne({ username: username })
            if (existingLoanee) {
                return res.status(400).json({ message: 'Username already taken' })
            }

            let loaneeInfo = req.body
            if (empty(loaneeInfo.spouse)) {
                loaneeInfo.spouse = null
            }

            const newLoanee = await Loanee.create(loaneeInfo)
            return res.json(newLoanee)
        } catch (e) {
            if (e.name === 'ValidationError') {
                return res.status(400).json({ message: e.errors[Object.keys(e.errors)[0]].message })
            }
            console.error(e)
            return next(e)
        }
    })(req, res, next)
})

/**
 * Edit the information of a user in the users listing.
 * @name post/edit
 * @function
 * @memberof module:routes/users~router-users
 * @inner
 */
router.patch('/:username', async function (req, res, next) {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const loanee = await Loanee.findOne({ username: req.params.username })
            if (!loanee) {
                return res.status(400).json({ message: 'Username does not exist' })
            }

            let loaneeInfo = req.body
            if (empty(loaneeInfo.spouse)) {
                loaneeInfo.spouse = null
            }

            const updatedLoanee = await Loanee.updateOne({ _id: loanee._id }, loaneeInfo, {
                runValidators: true
            })
            return res.json(updatedLoanee)
        } catch (e) {
            if (e.name === 'ValidationError') {
                return res.status(400).json({ message: e.errors[Object.keys(e.errors)[0]].message })
            }
            return next(e)
        }
    })(req, res, next)
})

/**
 * Delete the information of a user in the users listing.
 * @name post/delete
 * @function
 * @memberof module:routes/users~router-users
 * @inner
 */
router.delete('/:username', async function (req, res, next) {
    passport.authenticate('is-manager', { session: false }, async (err, manager, info) => {
        if (err) return next(err)
        if (!manager) return res.status(401).json(info)

        try {
            const loanee = await Loanee.findOne({ username: req.params.username })
            if (!loanee) {
                return res.status(400).json({ message: 'Username does not exist' })
            }
            const updatedLoanee = await Loanee.updateOne({ _id: loanee._id }, { deleted: true })
            return res.json(updatedLoanee)
        } catch (e) {
            if (e.name === 'ValidationError') {
                return res.status(400).json({ message: e.errors[Object.keys(e.errors)[0]].message })
            }
            return next(e)
        }
    })(req, res, next)
})

export default router

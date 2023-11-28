/**
 * Express index route.
 * @module routes/index
 * @requires express
 */

import express from 'express'

/**
 * Router to mount routes on.
 * @const
 * @namespace router-index
 */
const router = express.Router()

/**
 * GET home page.
 * @name get
 * @function
 * @memberof module:routes/index~router-index
 * @inner
 */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})

export default router

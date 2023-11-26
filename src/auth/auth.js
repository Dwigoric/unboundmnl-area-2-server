// Packages
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import argon2 from 'argon2'

// Schema
import Admin from '../models/admin.js'
import LoanOfficer from '../models/loan_officer.js'

/**
 * Configure admin login strategy
 *
 * This strategy is used to authenticate an admin.
 */
passport.use(
    'admin-login',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async function verify(username, password, done) {
            try {
                const admin = await Admin.findOne({ username }).lean()

                if (!admin) {
                    return done(null, false, { message: 'Incorrect credentials' })
                }

                const passwordValid = await argon2.verify(admin.password_hash, password)

                if (!passwordValid) {
                    return done(null, false, { message: 'Incorrect credentials' })
                }

                return done(null, admin, { message: 'Logged in' })
            } catch (error) {
                done(error)
            }
        }
    )
)

/**
 * Configure loan officer login strategy
 *
 * This strategy is used to authenticate a loan officer.
 */
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async function verify(username, password, done) {
            try {
                const loanOfficer = await LoanOfficer.findOne({ username }).lean()

                if (!loanOfficer) {
                    return done(null, false, { message: 'Incorrect credentials' })
                }

                const passwordValid = await argon2.verify(loanOfficer.password_hash, password)

                if (!passwordValid) {
                    return done(null, false, { message: 'Incorrect credentials' })
                }

                return done(null, loanOfficer, { message: 'Logged in' })
            } catch (error) {
                done(error)
            }
        }
    )
)

/**
 * Configure loan officer registration strategy
 *
 * This strategy is used to register a new loan officer.
 * It checks if the username is already taken and if not,
 * creates a new loan officer. The admin must be logged in
 * to use this strategy.
 */
passport.use(
    'admin',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        async function verify(payload, done) {
            // Retrieve admin from request body's UUID
            const admin = await Admin.findOne({ id: payload.uuid }).lean()

            // Check if admin exists
            if (!admin) {
                return done(null, false, { message: 'Incorrect credentials' })
            }

            // Return so route can continue
            return done(null, payload)
        }
    )
)

/**
 * Configure JWT strategy
 *
 * This strategy is used to authenticate an admin or a loan officer using a JWT.
 * JWT authentication is used to protect endpoints that require
 * authentication of either an admin or a loan officer.
 */
passport.use(
    'is-manager',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        async function verify(payload, done) {
            try {
                const manager = await (payload.type === 'admin' ? Admin : LoanOfficer)
                    .findOne({ id: payload.uuid })
                    .lean()

                if (!manager) {
                    return done(null, false)
                }

                done(null, manager)
            } catch (error) {
                done(error)
            }
        }
    )
)

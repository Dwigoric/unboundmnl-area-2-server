// Packages
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import argon2 from 'argon2'

// Schema
import Admin from '../models/admin.js'
import LoanOfficer from '../models/loan_officer.js'

/**
 * Configure admin/loan officer login strategy
 *
 * This strategy is used to authenticate an admin or a loan officer.
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
                const loanOfficer = await LoanOfficer.findOne({ username })

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
    'register',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        async function verify(payload, done) {
            // Check if admin is used to register a new loan officer
            if (payload.id !== 'admin') {
                return done(null, false, { message: 'Incorrect credentials' })
            }
            // Check the Admin model to verify the admin exists
            if (!(await Admin.exists({ username: payload.username }))) {
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
 * This strategy is used to authenticate a user using a JWT.
 * JWT authentication is used to protect endpoints that require
 * authentication.
 */
passport.use(
    'jwt',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        async function verify(payload, done) {
            try {
                const loanOfficer = await LoanOfficer.findOne({ username: payload.username })

                if (!loanOfficer) {
                    return done(null, false)
                }

                done(null, loanOfficer)
            } catch (error) {
                done(error)
            }
        }
    )
)
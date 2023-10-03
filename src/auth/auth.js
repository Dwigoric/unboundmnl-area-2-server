// Packages
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import argon2 from 'argon2'

// Schema
import Admin from '../models/admin.js'
import LoanOfficer from '../models/loan_officer.js'

/**
 * Configure loan officer registration strategy
 *
 * This strategy is used to register a new loan officer.
 * It checks if the username is already taken and if not,
 * creates a new loan officer.
 */
passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async function verify(username, password, done) {
            try {
                const loanOfficer = await LoanOfficer.findOne({ username })

                if (loanOfficer) {
                    return done(null, false, {
                        message: 'Username already taken'
                    })
                }

                const hashedPassword = await argon2.hash(password)

                const newAdmin = await Admin.create({
                    username,
                    password: hashedPassword
                })

                return done(null, newAdmin)
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
                const loanOfficer = await LoanOfficer.findOne({ username })

                if (!loanOfficer) {
                    return done(null, false, { message: 'User not found' })
                }

                const passwordValid = await argon2.verify(loanOfficer.password_hash, password)

                if (!passwordValid) {
                    return done(null, false, { message: 'Wrong password' })
                }

                return done(null, loanOfficer, { message: 'Logged in' })
            } catch (error) {
                done(error)
            }
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
                const loanOfficer = await LoanOfficer.findById(payload.sub)

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

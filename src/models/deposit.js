/**
 * Database model for Deposit info
 * @module models/deposit
 */

// Import packages
import { Schema, model, Decimal128 } from 'mongoose'
import { v5 as uuidV5 } from 'uuid'

// Import schema
import DepositTransactionSchema from './depositTransactionSchema.js'

const DepositSchema = new Schema({
    depositID: {
        type: String,
        unique: true,
        immutable: true
    },
    username: {
        type: String,
        required: true,
        index: 1
    },
    approvalDate: {
        type: Date,
        immutable: true
    },
    submissionDate: {
        type: Date
    },
    nextInterestDate: {
        type: Date
    },
    originalDepositAmount: {
        type: Decimal128,
        required: true
    },
    runningAmount: {
        type: Decimal128,
        validate: {
            validator: (v) => {
                return v >= 0
            },
            message: 'Running amount must be at least 0'
        }
    },
    ledger: [DepositTransactionSchema],
    status: {
        type: String,
        required: true,
        validate: {
            validator: (status) => {
                return ['pending', 'accepted', 'rejected', 'complete'].includes(status)
            },
            message: 'Status must be either "pending", "accepted", "rejected", or "complete"'
        }
    },
    category: {
        type: String,
        required: true,
        validate: {
            validator: (category) => {
                return ['shareCapital', 'savings', 'timeDeposit'].includes(category)
            },
            message: 'Category must be either "shareCapital", "savings", or "timeDeposit"'
        }
    },
    deleted: { type: Boolean, default: false }
})

DepositSchema.pre('save', function (next) {
    if (this.isNew) this.set('depositID', uuidV5(Date.now().toString(), uuidV5.URL))
    next()
})

DepositSchema.pre(['find', 'findOne'], function () {
    this.where({ deleted: false })
})

/**
 * Deposit Mongoose model. Stores information about deposit transactions, such as
 * share capital and savings deposits.
 *
 * @prop {String} depositID - Automatically generated deposit ID. Uses uuidv5.
 * @prop {String} username - Username of the user that owns this deposit.
 * @prop {Date} approvalDate - Date the deposit was approved.
 * @prop {Date} submissionDate - Date the deposit was submitted to the database.
 * @prop {Date} nextInterestDate - Next date the deposit will gain interest.
 * @prop {Decimal128} originalDepositAmount - Original amount that was deposited.
 * @prop {Decimal128} runningAmount - Current balance of the deposit.
 * @prop {[DepositTransactionSchema]} ledger - Deposit transaction ledger.
 * @prop {String} status - Current deposit status. One of 'pending', 'accepted', 'rejected', or 'complete'.
 * @prop {String} category - Deposit category. One of 'shareCapital', 'savings', or 'timeDeposit'.
 * @prop {Boolean} deleted - Whether or not the deposit is deleted.
 */
const Deposit = model('Deposit', DepositSchema)

export default Deposit

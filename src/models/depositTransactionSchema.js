/**
 * Schema to represent a single transaction in a deposit's transaction ledger.
 * @module models/depositTransactionSchema
 */

// Import packages
import { Schema, Decimal128 } from 'mongoose'

import NameSchema from './nameSchema.js'

/**
 * Schema to represent deposit settings for a single deposit category.
 *
 * @prop {String} transactionID - Autogenerated transaction ID. Uses base36.
 * @prop {String} ORNumber - Deposit OR number. Manually inputted, duplicates are allowed.
 * @prop {Date} transactionDate - Date the transaction was made.
 * @prop {Date} submissionDate - Date the transaction was submitted to the system.
 * @prop {String} transactionType - Type of transaction. Must be either 'Deposit' or 'Withdrawal'.
 * @prop {mongoose.Decimal128} amount - Amount paid during transaction.
 * @prop {mongoose.Decimal128} interest - Interest gained during transaction. Separate transactions are made every time interest is calculated.
 * @prop {mongoose.Decimal128} balance - Remaining balance in the deposit account after transaction.
 * @prop {NameSchema} officerInCharge - Name of the officer in charge of the transaction.
 */
const DepositTransactionSchema = new Schema({
    transactionID: {
        type: String,
        unique: true,
        sparse: true,
        immutable: true
    },
    ORNumber: {
        type: String
    },
    transactionDate: {
        type: Date,
        required: true
    },
    submissionDate: {
        type: Date,
        required: true
    },
    transactionType: {
        type: String,
        required: true,
        validate: {
            validator: (val) => {
                return ['deposit', 'withdrawal', 'Deposit', 'Withdrawal'].includes(val)
            },
            message: 'Transaction Type must be either "Deposit" or "Withdrawal"'
        }
    },
    amount: {
        type: Decimal128,
        required: true
    },
    interest: {
        type: Decimal128,
        required: true
    },
    balance: {
        type: Decimal128,
        required: true
    },
    officerInCharge: {
        type: NameSchema,
        required: true
    }
})

DepositTransactionSchema.pre('save', function (next) {
    if (this.isNew) this.set('transactionID', Date.now().toString(36).toUpperCase())
    next()
})

export default DepositTransactionSchema

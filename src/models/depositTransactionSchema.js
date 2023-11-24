// Import packages
import { Schema, Decimal128 } from 'mongoose'

import NameSchema from './nameSchema.js'

const DepositTransactionSchema = new Schema({
    transactionID: {
        type: String,
        unique: true,
        sparse: true,
        immutable: true
    },
    ORNumber: {
        type: String,
        required: true
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

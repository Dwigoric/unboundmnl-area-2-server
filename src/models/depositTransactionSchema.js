// Import packages
import { Schema } from 'mongoose'

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
    depositType: {
        type: String,
        required: true,
        validate: {
            validator: (val) => {
                return ['deposit', 'withdrawal'].includes(val)
            },
            message: 'Deposit Type must be either "deposit" or "withdrawal"'
        }
    },
    amount: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
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

// Import packages
import { Schema } from 'mongoose'

// Import schema
import NameSchema from './nameSchema.js'

const LoanTransactionSchema = new Schema({
    transactionID: {
        type: String,
        unique: true,
        immutable: true
    },
    ORNumber: {
        type: String,
        required: true,
        immutable: true
    },
    date: {
        type: Date,
        required: true,
        immutable: true
    },
    amountPaid: {
        type: Number,
        required: true,
        immutable: true
    },
    balance: {
        type: Number,
        required: true,
        immutable: true
    },
    interestPaid: {
        type: Number,
        required: true,
        immutable: true
    },
    finesPaid: {
        type: Number,
        required: true,
        immutable: true
    },
    officerInCharge: {
        type: NameSchema,
        required: true,
        immutable: true
    }
})

LoanTransactionSchema.pre('save', function (next) {
    if (this.isNew) this.set('transactionID', Date.now().toString(36).toUpperCase())
    next()
})

export default LoanTransactionSchema

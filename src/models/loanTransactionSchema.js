// Import packages
import { Schema } from 'mongoose'

// Import schema
import NameSchema from './nameSchema.js'

const LoanTransactionSchema = new Schema({
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
        required: true,
        immutable: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    interestPaid: {
        type: Number,
        required: true
    },
    finesPaid: {
        type: Number,
        required: true
    },
    officerInCharge: {
        type: NameSchema,
        required: true
    }
})

LoanTransactionSchema.pre('save', function (next) {
    if (this.isNew) this.set('transactionID', Date.now().toString(36).toUpperCase())
    next()
})

export default LoanTransactionSchema

// Import packages
import { Schema, Decimal128 } from 'mongoose'

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
        type: Decimal128,
        required: true
    },
    balance: {
        type: Decimal128,
        required: true
    },
    interestPaid: {
        type: Decimal128,
        required: true
    },
    finesPaid: {
        type: Decimal128,
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

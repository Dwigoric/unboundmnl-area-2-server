// Import packages
import { Schema } from 'mongoose'

// Import schema
import NameSchema from './nameSchema.js'

const LoanTransactionSchema = new Schema({
    transactionID: {
        type: String,
        unique: true,
        immutable: true,
        default: () => Date.now().toString(36).toUpperCase() // Base36 string from current timestamp
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

export default LoanTransactionSchema

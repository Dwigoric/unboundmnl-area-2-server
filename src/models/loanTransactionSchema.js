import { Schema } from 'mongoose'

import NameSchema from './nameSchema.js'

const LoanTransactionSchema = new Schema({
    transactionID: {
        type: String,
        required: true
        // validation
    },
    ORNumber: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true
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

export default LoanTransactionSchema
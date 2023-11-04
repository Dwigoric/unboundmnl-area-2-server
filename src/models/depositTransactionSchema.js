import { Schema } from 'mongoose'

const DepositTransactionSchema = new Schema({
    transactionID: {
        type: String,
        required: true,
        // validation
    },
    ORNumber: {
        type: String,
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    amountReceived: {
        type: Number,
        required: true
    },
    amountWithdrawn: {
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
    }
})

export default DepositTransactionSchema
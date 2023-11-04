// Import packages
import { Schema } from 'mongoose'

const DepositTransactionSchema = new Schema({
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
    transactionDate: {
        type: Date,
        required: true,
        immutable: true
    },
    amountReceived: {
        type: Number,
        required: true,
        immutable: true
    },
    amountWithdrawn: {
        type: Number,
        required: true,
        immutable: true
    },
    interest: {
        type: Number,
        required: true,
        immutable: true
    },
    balance: {
        type: Number,
        required: true,
        immutable: true
    }
})

export default DepositTransactionSchema

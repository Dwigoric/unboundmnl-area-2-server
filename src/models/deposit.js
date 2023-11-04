import { Schema, model } from 'mongoose'
import DepositTransactionSchema from './depositTransactionSchema.js'

const DepositSchema = new Schema({
    depositID: {
        type: String,
        required: true,
        // validation?
    },
    username: {
        type: String,
        required: true,
    },
    approvalDate: {
        type: Date,
        required: true,
    },
    ledger: [DepositTransactionSchema],
    status: {
        type: String,
        required: true,
        validate: {
            validator: (status) => {
                return ['pending', 'accepted', 'rejected', 'complete'].includes(status)
            },
            message: 'Status must be either "pending", "accepted", "rejected", or "complete"'
        }
    }
})

const Deposit = model('Deposit', DepositSchema)

export default Deposit
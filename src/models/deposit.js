// Import packages
import { Schema, model } from 'mongoose'
import { v5 as uuidV5 } from 'uuid'

// Import schema
import DepositTransactionSchema from './depositTransactionSchema.js'

const DepositSchema = new Schema({
    depositID: {
        type: String,
        required: true,
        immutable: true,
        default: () => uuidV5(Date.now().toString(), uuidV5.URL)
    },
    username: {
        type: String,
        required: true
    },
    approvalDate: {
        type: Date,
        required: true,
        immutable: true
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

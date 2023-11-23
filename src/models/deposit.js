// Import packages
import { Schema, model, Decimal128 } from 'mongoose'
import { v5 as uuidV5 } from 'uuid'

// Import schema
import DepositTransactionSchema from './depositTransactionSchema.js'

const DepositSchema = new Schema({
    depositID: {
        type: String,
        unique: true,
        immutable: true
    },
    username: {
        type: String,
        required: true,
        index: 1
    },
    approvalDate: {
        type: Date,
        immutable: true
    },
    interestRate: {
        type: Decimal128,
        required: true
    },
    originalDepositAmount: {
        type: Decimal128,
        required: true
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
    },
    category: {
        type: String,
        required: true
    },
    deleted: { type: Boolean, default: false }
})

DepositSchema.pre('save', function (next) {
    if (this.isNew) this.set('depositID', uuidV5(Date.now().toString(), uuidV5.URL))
    next()
})

DepositSchema.pre(['find', 'findOne'], function () {
    this.where({ deleted: false })
})

const Deposit = model('Deposit', DepositSchema)

export default Deposit

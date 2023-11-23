// Import packages
import { Schema, model, Decimal128 } from 'mongoose'
import { v5 as uuidV5 } from 'uuid'

// Import schema
import LoanTransactionSchema from './loanTransactionSchema.js'
import NameSchema from './nameSchema.js'

const LoanSchema = new Schema({
    loanID: {
        type: String,
        unique: true,
        immutable: true
    },
    username: {
        type: String,
        required: true,
        index: 1
    },
    loanType: {
        type: String,
        required: true,
        validate: {
            validator: (loanType) => {
                return [
                    'emergency',
                    'multi-purpose',
                    'educational',
                    'petty cash',
                    'commercial',
                    'livelihood'
                ].includes(loanType)
            },
            message:
                'Loan type must be "emergency", "multi-purpose", "educational",' +
                ' "petty cash", "commercial", or "livelihood"'
        }
    },
    term: {
        type: Number,
        required: true
    },
    paymentFrequency: {
        type: String,
        required: true,
        validate: {
            validator: (val) => {
                return ['daily', 'weekly', 'monthly'].includes(val)
            },
            message: 'Payment frequency must be either "daily", "weekly", or "monthly"'
        }
    },
    submissionDate: {
        type: Date,
        required: true,
        immutable: true
    },
    approvalDate: {
        type: Date
    },
    dueDate: {
        type: Date
    },
    coborrower: {
        name: NameSchema,
        birthday: Date,
        birthplace: String,
        occupation: String,
        contact_no: String
    },
    originalLoanAmount: {
        type: Decimal128,
        required: true,
        immutable: true
    },
    ledger: [LoanTransactionSchema],
    status: {
        type: String,
        required: true,
        validate: {
            validator: (status) => {
                return ['pending', 'approved', 'released', 'rejected', 'complete'].includes(status)
            },
            message:
                'Status must be either "pending", "approved", "released", "rejected", or "complete"'
        }
    },
    classification: {
        type: String,
        required: true,
        validate: {
            validator: (classification) => {
                return ['new', 'renewal'].includes(classification)
            },
            message: 'Classification must be either "new" or "renewal"'
        }
    },
    balance: {
        type: Decimal128,
        validate: {
            validator: (bal) => {
                return bal >= 0
            },
            message: 'Balance must be at least 0'
        }
    },
    deleted: { type: Boolean, default: false }
})

LoanSchema.pre('save', function (next) {
    if (this.isNew) {
        this.set('loanID', uuidV5(Date.now().toString(), uuidV5.URL))
        this.set('balance', this.originalLoanAmount)
    }

    next()
})

const Loan = model('Loan', LoanSchema)

export default Loan

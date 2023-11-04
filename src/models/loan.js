import { Schema, model } from 'mongoose'
import LoanTransactionSchema from './loanTransactionSchema.js'
import NameSchema from './nameSchema.js'

const LoanSchema = new Schema({
    loanID: {
        type: String,
        required: true
    },
    username: {
        type: String, 
        required: true
    },
    loanType: {
        type: String, 
        required: true,
        validate: {
            validator: (loanType) => {
                return [
                    'emergency', 'multi-purpose', 'educational', 
                    'petty cash', 'commercial', 'livelihood'
                ].includes(loanType)
            },
            message: 'Loan type must be "emergency", "multi-purpose", "educational",' + 
                ' "petty cash", "commercial", or "livelihood"'
        }
    },
    term: {
        type: Number,
        required: true
    },
    submissionDate: {
        type: Date,
        required: true
    },
    approvalDate: Date,
    coborrowerName: {
        type: NameSchema,
        required: true
    },
    originalLoanAmount: {
        type: Number,
        required: true
    },
    ledger: [LoanTransactionSchema],
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
    classification: {
        type: String,
        required: true,
        validate: {
            validator: (classification) => {
                return ['new', 'renewal'].includes(classification)
            },
            message: 'Classification must be either "new" or "renewal"'
        }
    }

})

const Loan = model('Loan', LoanSchema)

export default Loan
/**
 * Model to represent loans.
 * @module models/loan
 */

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
                    'multipurpose',
                    'educational',
                    'pettyCash',
                    'commercial',
                    'livelihood'
                ].includes(loanType)
            },
            message:
                'Loan type must be "emergency", "multipurpose", "educational",' +
                ' "pettyCash", "commercial", or "livelihood"'
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
                return ['days', 'weekly', 'months'].includes(val)
            },
            message: 'Payment frequency must be either "days", "weekly", or "monthly"'
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
    releaseDate: {
        type: Date
    },
    nextInterestDate: {
        type: Date
    },
    isPaidForCurrentPeriod: {
        type: Boolean,
        default: false
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

/**
 * Model to represent a single loan in the database.
 *
 * @prop {String} loanID - Automatically generated ID of the loan. Uses uuidv5.
 * @prop {String} username - Username of the loanee.
 * @prop {String} loanType - Type of loan. Can be "emergency", "multipurpose", "educational", "pettyCash", "commercial", or "livelihood".
 * @prop {Number} term - Term of the loan. How many payments are to be made to complete the loan.
 * @prop {String} paymentFrequency - How often payments are made for the loan.
 * @prop {Date} submissionDate - Date when the loan was submitted to the system.
 * @prop {Date} approvalDate - Date when the loan was approved by an officer.
 * @prop {Date} dueDate - Date when the loan is due next.
 * @prop {Date} releaseDate - Date when the loan cash was released to the loanee.
 * @prop {Date} nextInterestDate - When the loan will next gain interest.
 * @prop {Boolean} isPaidForCurrentPeriod - Whether or not the loan is already paid for the current payment period.
 * @prop {Object} coborrower - Loan coborrower. Contains the name (NameSchema), birthday (Date), occupation, and contact number (both Strings) of the coborrower.
 * @prop {mongoose.Decimal128} originalLoanAmount - Original amount loaned.
 * @prop {LoanTransactionSchema[]} ledger - List of transactions making up the loan.
 * @prop {String} status - Status of the loan. Must be "pending", "approved", "released", "rejected", or "complete".
 * @prop {String} classification - Classification of the loan. Must be "new" or "renewal".
 * @prop {mongoose.Decimal128} balance - Current outstanding loan balance.
 * @prop {Boolean} deleted - Whether or not the loan is deleted.
 */
const Loan = model('Loan', LoanSchema)

export default Loan

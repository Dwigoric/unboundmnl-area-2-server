/**
 * Schema for representing transactions in a loan's ledger.
 * @module models/loanTransactionSchema
 */

// Import packages
import { Schema, Decimal128 } from 'mongoose'

// Import schema
import NameSchema from './nameSchema.js'

/**
 * Schema to represent a single Loan Transaction in the ledger.
 *
 * @prop {String} transactionID - Automatically generated transaction ID. Uses base36
 * @prop {String} ORNumber - OR number of transaction. Does not have to be unique.
 * @prop {Date} transactionDate - Date the transaction was made.
 * @prop {Date} submissionDate - Date the transaction was submitted to the system.
 * @prop {mongoose.Decimal128} amountPaid - Amount paid during transaction.
 * @prop {mongoose.Decimal128} amountDue - Other amounts due in this transaction outside of interests or fines.
 * @prop {mongoose.Decimal128} balance -  Outstanding loan balance after transaction.
 * @prop {mongoose.Decimal128} interestPaid - Amount of interest paid during transaction.
 * @prop {mongoose.Decimal128} interestDue - Amount of interest added to the loan during transaction.
 * @prop {mongoose.Decimal128} finesDue - Amount of fines paid during transaction.
 * @prop {mongoose.Decimal128} finesPaid - Amount of fines added to the loan during transaction.
 * @prop {NameSchema} officerInCharge - Name of the officer in charge of the transaction.
 */
const LoanTransactionSchema = new Schema({
    transactionID: {
        type: String,
        unique: true,
        sparse: true,
        immutable: true
    },
    ORNumber: {
        type: String
    },
    transactionDate: {
        type: Date,
        required: true
    },
    submissionDate: {
        type: Date,
        required: true,
        immutable: true
    },
    amountPaid: {
        type: Decimal128,
        required: true
    },
    amountDue: {
        type: Decimal128,
        required: false,
        default: 0
    },
    balance: {
        type: Decimal128,
        required: true
    },
    interestPaid: {
        type: Decimal128,
        required: true
    },
    interestDue: {
        type: Decimal128,
        required: false,
        default: 0
    },
    finesDue: {
        type: Decimal128,
        required: true
    },
    finesPaid: {
        type: Decimal128,
        required: true
    },
    officerInCharge: {
        type: NameSchema,
        required: true
    }
})

LoanTransactionSchema.pre('save', function (next) {
    if (this.isNew) this.set('transactionID', Date.now().toString(36).toUpperCase())
    next()
})

export default LoanTransactionSchema

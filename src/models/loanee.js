import { Schema, model } from 'mongoose'
import NameSchema from './nameSchema.js'
import SpouseSchema from './spouseSchema.js'
import LocationSchema from './locationSchema.js'

const LoaneeSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        validate: {
            validator: (username) => {
                const regex = /^[a-zA-Z0-9_]{6,20}$/
                return regex.test(username)
            },
            message:
                'Username must be between 6 and 20 characters and contain only letters, numbers, and underscores'
        }
    },
    name: {
        type: NameSchema,
        required: [true, 'Name is required']
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday is required']
    },
    birthplace: {
        type: String,
        required: [true, 'Birthplace is required']
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
        required: [true, 'Gender is required']
    },
    civil_status: {
        type: String,
        enum: ['Single', 'Married'],
        required: [true, 'Civil Status is required']
    },
    tin_no: {
        type: String,
        required: [true, 'TIN Number is required'],
        validate: {
            validator: (tin_no) => {
                const regex = /^[0-9]{3}-[0-9]{3}-[0-9]{3}-[0-9]{3}$/
                return regex.test(tin_no)
            },
            message:
                'TIN number must be of the format XXX-XXX-XXX-XXX where X is a number from 0 to 9'
        }
    },
    contact_no: {
        type: String,
        required: [true, 'Contact Number is required']
    },
    monthly_income: {
        type: Number,
        required: [true, 'Monthly Income is required'],
        min: [0, 'Monthly income cannot be negative']
    },
    address: {
        type: LocationSchema,
        required: [true, 'Address is required']
    },
    occupation: {
        type: String,
        required: [true, 'Occupation is required']
    },
    spouse: { type: SpouseSchema },
    deleted: { type: Boolean, default: false }
    // loans: [Loan]
})

LoaneeSchema.pre('find', function () {
    this.where({ deleted: false })
})

LoaneeSchema.pre('findOne', function () {
    this.where({ deleted: false })
})

const Loanee = model('Loanee', LoaneeSchema)

export default Loanee

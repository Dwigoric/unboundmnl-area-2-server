/**
 * Model to represent users (loanees) in the system.
 * @module models/loanee
 */

import { Schema, model } from 'mongoose'
import NameSchema from './nameSchema.js'
import SpouseSchema from './spouseSchema.js'
import LocationSchema from './locationSchema.js'

const LoaneeSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
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
    sex: {
        type: String,
        enum: ['M', 'F'],
        required: [true, 'Sex is required']
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
    onanimationstartccupation: {
        type: String,
        required: [true, 'Occupation is required']
    },
    spouse: { type: SpouseSchema },
    deleted: { type: Boolean, default: false }
})

// Finding by text will search both username and name fields
LoaneeSchema.index(
    {
        username: 'text',
        'name.given': 'text',
        'name.middle': 'text',
        'name.last': 'text'
    },
    {
        weights: {
            username: 20,
            'name.given': 5,
            'name.middle': 3,
            'name.last': 5
        }
    }
)

LoaneeSchema.pre(['find', 'findOne'], function () {
    this.where({ deleted: false })
})

/**
 * Model to represent deposit settings for a single deposit category.
 *
 * @prop {String} username - Username, unique identifier per user.
 * @prop {NameSchema} name - User's full name.
 * @prop {Date} birthday - User's birthday.
 * @prop {String} birthplace - User's birthplace.
 * @prop {String} sex - User's sex. Must be either 'M' or 'F'
 * @prop {String} civil_status - User's civil status. Must be either 'Single' or 'Married'
 * @prop {String} tin_no - TIN number of the user. Must be of the format XXX-XXX-XXX-XXX where X is a number from 0 to 9
 * @prop {String} contact_no - User's contact number..
 * @prop {Number} monthly_income - Users' monthly income.
 * @prop {LocationSchema} address - Users' address.
 * @prop {String} occupation - Users' occupation.
 * @prop {SpouseSchema} spouse - Users' spouse, if any.
 * @prop {Boolean} deleted - Whether or not the user is deleted.
 */
const Loanee = model('Loanee', LoaneeSchema)

export default Loanee

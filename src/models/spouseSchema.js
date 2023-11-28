/**
 * Schema to represent a loanee's spouse. Primarily stored for autofilling forms.
 * @module models/spouseSchema
 */

import { Schema } from 'mongoose'
import NameSchema from './nameSchema.js'

/**
 * Schema to represent deposit settings for a single deposit category.
 *
 * @prop {NameSchema} name - Spouse's name.
 * @prop {Date} birthday - Spouse's birthday.
 * @prop {String} birthplace - Spouse's birthplace.
 * @prop {String} occupation - Spouse's occupation.
 * @prop {String} contact_no - Spouse's contact number.
 */
const SpouseSchema = new Schema({
    name: { type: NameSchema, required: [true, 'Name is required if spouse exists'] },
    birthday: { type: Date, required: [true, 'Birthday is required if spouse exists'] },
    birthplace: { type: String, required: [true, 'Birthplace is required if spouse exists'] },
    occupation: { type: String, required: [true, 'Occupation is required if spouse exists'] },
    contact_no: { type: String, required: [true, 'Contact Number is required if spouse exists'] }
})

export default SpouseSchema

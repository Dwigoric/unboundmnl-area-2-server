/**
 * Schema for representing a person's name in the Mongoose database.
 * @module models/nameSchema
 */

import { Schema } from 'mongoose'

/**
 * Schema for representing a person's name in the Mongoose database.
 *
 * @prop {String} given - Person's given name
 * @prop {String} middle - Person's middle name (if any)
 * @prop {String} last - Person's last name
 */
const NameSchema = new Schema({
    given: {
        type: String,
        required: [true, 'Given name is required']
    },
    middle: String,
    last: {
        type: String,
        required: [true, 'Last name is required']
    }
})

export default NameSchema

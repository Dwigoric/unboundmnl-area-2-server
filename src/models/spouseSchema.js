import { Schema } from 'mongoose'
import NameSchema from './nameSchema.js'

const SpouseSchema = new Schema({
    name: {type: NameSchema, required: [true, 'Name is required if spouse exists']},
    birthday: {type: Date, required: [true, 'Birthday is required if spouse exists']},
    birthplace: {type: String, required: [true, 'Birthplace is required if spouse exists']},
    contact_no: {type: String, required: [true, 'Contact Number is required if spouse exists']}
}) 

export default SpouseSchema
import { Schema } from 'mongoose'
import NameSchema from './nameSchema.js'

const SpouseSchema = new Schema({
    name: {type: NameSchema, required: [true, 'Name is required']},
    birthday: {type: Date, required: [true, 'Birthday is required']},
    birthplace: {type: String, required: [true, 'Birthplace is required']},
    contact_no: {type: String, required: [true, 'Contact Number is required']}
}) 

export default SpouseSchema
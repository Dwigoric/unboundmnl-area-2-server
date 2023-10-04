import { Schema } from 'mongoose'
import NameSchema from './nameSchema.js'

const SpouseSchema = new Schema({
    name: {type: NameSchema, required: true},
    birthday: {type: Date, required: true},
    birthplace: {type: String, required: true},
    contact_no: {type: String, required: true}
}) 

export default SpouseSchema
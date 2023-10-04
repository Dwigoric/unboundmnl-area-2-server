import { Schema } from 'mongoose'

const NameSchema = new Schema({
    given: {type: String, required: true},
    middle: String,
    last: {type: String, required: true}
}) 

export default NameSchema
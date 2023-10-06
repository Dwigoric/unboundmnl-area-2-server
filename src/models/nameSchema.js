import { Schema } from 'mongoose'

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

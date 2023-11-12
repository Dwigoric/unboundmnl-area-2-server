// Packages
import { Schema } from 'mongoose'

const InvidualSettingSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed amount'],
        default: 'percentage'
    },
    value: {
        type: Number,
        default: 0
    },
    enabled: {
        type: Boolean,
        default: false
    }
})

export default InvidualSettingSchema

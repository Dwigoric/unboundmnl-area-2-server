// Packages
import { Schema } from 'mongoose'

const TimeSettingSchema = new Schema({
    type: {
        type: String,
        enum: ['daily', 'monthly', 'yearly'],
        default: 'monthly'
    },
    value: {
        type: Schema.Types.BigInt,
        default: 0
    }
})

export default TimeSettingSchema

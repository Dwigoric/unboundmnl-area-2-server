// Packages
import { Schema } from 'mongoose'

const TimeSettingSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['days', 'months', 'years'],
            default: 'months'
        },
        value: {
            type: Schema.Types.BigInt,
            default: 0
        }
    },
    { _id: false }
)

export default TimeSettingSchema

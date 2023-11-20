// Packages
import { Schema } from 'mongoose'

const InvidualSettingSchema = new Schema(
    {
        unit: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            default: 0
        },
        enabled: {
            type: Boolean,
            default: false
        }
    },
    { _id: false }
)

export default InvidualSettingSchema

// Packages
import { Schema, Decimal128 } from 'mongoose'

const InvidualSettingSchema = new Schema(
    {
        unit: {
            type: String,
            required: true
        },
        value: {
            type: Decimal128,
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

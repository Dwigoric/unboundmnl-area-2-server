// Packages
import { Schema, Decimal128 } from 'mongoose'

const MandatoryInvidualSettingSchema = new Schema(
    {
        unit: {
            type: String,
            required: true
        },
        value: {
            type: Decimal128,
            default: 0
        }
    },
    { _id: false }
)

export default MandatoryInvidualSettingSchema

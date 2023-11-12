// Packages
import { Schema } from 'mongoose'

// Import schema
import IndividualSettingSchema from './individualSettingSchema.js'

const DepositSettingsSchema = new Schema({
    interest_rate: IndividualSettingSchema,
    time: new Schema({
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
})

export default DepositSettingsSchema

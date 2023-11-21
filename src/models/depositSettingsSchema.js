// Packages
import { Schema } from 'mongoose'

// Import schema
import IndividualSettingSchema from './individualSettingSchema.js'
import TimeSettingSchema from './timeSettingSchema.js'

const DepositSettingsSchema = new Schema(
    {
        interest_rate: IndividualSettingSchema,
        time: TimeSettingSchema
    },
    { _id: false }
)

export default DepositSettingsSchema

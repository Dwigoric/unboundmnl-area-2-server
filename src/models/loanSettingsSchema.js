// Packages
import { Schema } from 'mongoose'

// Import schema
import IndividualSettingSchema from './individualSettingSchema.js'
import TimeSettingSchema from './timeSettingSchema.js'

const LoanSettingsSchema = new Schema(
    {
        interest_rate: IndividualSettingSchema,
        service_fee: IndividualSettingSchema,
        capital_build_up: IndividualSettingSchema,
        savings: IndividualSettingSchema,
        time: TimeSettingSchema
    },
    { _id: false }
)

export default LoanSettingsSchema

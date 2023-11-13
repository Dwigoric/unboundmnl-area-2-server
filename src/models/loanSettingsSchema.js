// Packages
import { Schema } from 'mongoose'

// Import schema
import IndividualSettingSchema from './individualSettingSchema.js'

const LoanSettingsSchema = new Schema(
    {
        interest_rate: IndividualSettingSchema,
        service_fee: IndividualSettingSchema,
        capital_build_up: IndividualSettingSchema,
        savings: IndividualSettingSchema,
        credit_life_insurance: IndividualSettingSchema
    },
    { _id: false }
)

export default LoanSettingsSchema

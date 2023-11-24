// Packages
import { Schema } from 'mongoose'

// Import schema
import IndividualSettingSchema from './individualSettingSchema.js'
import TimeSettingSchema from './timeSettingSchema.js'
import MandatoryIndividualSettingSchema from './mandatoryIndividualSettingSchema.js'

const LoanSettingsSchema = new Schema(
    {
        interest_rate: MandatoryIndividualSettingSchema,
        service_fee: IndividualSettingSchema,
        capital_build_up: IndividualSettingSchema,
        savings: IndividualSettingSchema,
        time: TimeSettingSchema
    },
    { _id: false }
)

export default LoanSettingsSchema

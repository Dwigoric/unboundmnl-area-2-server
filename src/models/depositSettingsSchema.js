// Packages
import { Schema } from 'mongoose'

// Import schema
import MandatoryIndividualSettingSchema from './mandatoryIndividualSettingSchema.js'
import TimeSettingSchema from './timeSettingSchema.js'

const DepositSettingsSchema = new Schema(
    {
        interest_rate: MandatoryIndividualSettingSchema,
        time: TimeSettingSchema
    },
    { _id: false }
)

export default DepositSettingsSchema

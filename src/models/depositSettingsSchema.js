/**
 * Schema to represent deposit settings for a single deposit category.
 * @module models/depositSettingsSchema
 */

// Packages
import { Schema } from 'mongoose'

// Import schema
import MandatoryIndividualSettingSchema from './mandatoryIndividualSettingSchema.js'
import TimeSettingSchema from './timeSettingSchema.js'

/**
 * Schema to represent deposit settings for a single deposit category.
 *
 * @prop {MandatoryIndividualSettingSchema} interest_rate - Interest rate of the deposit type.
 * @prop {TimeSettingSchema} time - Time period between interest applications.
 */
const DepositSettingsSchema = new Schema(
    {
        interest_rate: MandatoryIndividualSettingSchema,
        time: TimeSettingSchema
    },
    { _id: false }
)

export default DepositSettingsSchema

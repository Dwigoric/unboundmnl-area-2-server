/**
 * Schema for representing settings for a single loan type.
 * @module models/loanSettingsSchema
 */

// Packages
import { Schema } from 'mongoose'

// Import schema
import IndividualSettingSchema from './individualSettingSchema.js'
import TimeSettingSchema from './timeSettingSchema.js'
import MandatoryIndividualSettingSchema from './mandatoryIndividualSettingSchema.js'

/**
 * Schema for representing settings for a single loan type.
 *
 * @prop {MandatoryIndividualSettingSchema} interest_rate -The interest rate of the current loan type. Used for automatic interest calculations.
 * @prop {IndividualSettingSchema} service_fee - Initial service fees for the current loan type. Deducted from the loan value upon loan approval.
 * @prop {IndividualSettingSchema} capital_build_up - Capital build-up fee for the current loan type. Deducted from the loan value upon loan approval.
 * @prop {IndividualSettingSchema} savings - Savings contribution for the current loan type. Deducted from the loan value upon loan approval.
 * @prop {TimeSettingSchema} time - Time period between interest applications.
 */
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

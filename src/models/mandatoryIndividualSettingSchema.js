/**
 * Schema for representing financial values as settings. This setting is mandatory and is always on.
 * @module models/mandatoryIndividualSettingSchema
 */

// Packages
import { Schema, Decimal128 } from 'mongoose'

/**
 * Schema to represent a single Loan Transaction in the ledger.
 *
 * @prop {String} unit - Unit of the setting amount. Either '%' or 'Fixed'.
 * @prop {mongoose.Decimal128} value - Value of the setting amount. If unit is '%', how many percent the value represents. If unit is 'Fixed', how much money (in pesos) the value represents.
 */
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

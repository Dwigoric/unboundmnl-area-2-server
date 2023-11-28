/**
 * Schema to represent an individual setting for financial values, such as interest or fees.
 * @module models/individualSettingsSchema
 */

// Packages
import { Schema, Decimal128 } from 'mongoose'

/**
 * Schema to represent deposit settings for a single deposit category.
 *
 * @prop {String} unit - Unit of the setting amount. Either '%' or 'Fixed'.
 * @prop {Decimal128} value - Value of the setting amount. If unit is '%', how many percent the value represents. If unit is 'Fixed', how much money (in pesos) the value represents.
 * @prop {Boolean} enabled - Whether or not this particular setting is active.
 */
const InvidualSettingSchema = new Schema(
    {
        unit: {
            type: String,
            required: true
        },
        value: {
            type: Decimal128,
            default: 0
        },
        enabled: {
            type: Boolean,
            default: false
        }
    },
    { _id: false }
)

export default InvidualSettingSchema

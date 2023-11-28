/**
 * Schema to represent time-based settings or settings that use units of time.
 * @module models/timeSettingSchema
 */

// Packages
import { Schema } from 'mongoose'

/**
 * Schema to represent time-based settings or settings that use units of time.
 *
 * @prop {String} unit - Unit of time. Either "days", "months", or "years".
 * @prop {mongoose.BigInt} value - Number of time units.
 */
const TimeSettingSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['days', 'months', 'years'],
            default: 'months'
        },
        value: {
            type: Schema.Types.BigInt,
            default: 0
        }
    },
    { _id: false }
)

export default TimeSettingSchema

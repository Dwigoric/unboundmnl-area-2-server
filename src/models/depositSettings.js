/**
 * Database model for Deposit Settings
 * @module models/depositSettings
 */

// Packages
import { Schema, model } from 'mongoose'

// Import schema
import DepositSettingsSchema from './depositSettingsSchema.js'

/**
 * Deposit settings Mongoose model. Stores the current deposit settings.
 * @prop {DepositSettingsSchema} shareCapital - Settings for share capital deposits.
 * @prop {DepositSettingsSchema} savings - Settings for savings deposits.
 * @prop {DepositSettingsSchema} timeDeposit - Settings for time deposits.
 *
 */
const DepositSettings = model(
    'DepositSettings',
    new Schema({
        shareCapital: DepositSettingsSchema,
        savings: DepositSettingsSchema,
        timeDeposit: DepositSettingsSchema
    })
)

// Create default settings
DepositSettings.findOne()
    .lean()
    .then((existing) => {
        if (existing) return

        const settings = new DepositSettings({
            shareCapital: {
                interest_rate: { unit: '%', value: 0 },
                time: { type: 'months', value: 0 }
            },
            savings: {
                interest_rate: { unit: '%', value: 0 },
                time: { type: 'months', value: 0 }
            },
            timeDeposit: {
                interest_rate: { unit: '%', value: 0 },
                time: { type: 'months', value: 0 }
            }
        })

        settings.save()
    })

export default DepositSettings

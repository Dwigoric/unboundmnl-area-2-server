// Packages
import { Schema, model } from 'mongoose'

// Import schema
import DepositSettingsSchema from './depositSettingsSchema.js'

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
                interest_rate: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            },
            savings: {
                interest_rate: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            },
            timeDeposit: {
                interest_rate: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            }
        })

        settings.save()
    })

export default DepositSettings

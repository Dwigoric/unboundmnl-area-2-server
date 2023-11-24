// Packages
import { Schema, model } from 'mongoose'

// Import schema
import LoanSettingsSchema from './loanSettingsSchema.js'

const LoanSettings = model(
    'LoanSettings',
    new Schema({
        emergency: LoanSettingsSchema,
        educational: LoanSettingsSchema,
        pettyCash: LoanSettingsSchema,
        multipurpose: LoanSettingsSchema,
        commercial: LoanSettingsSchema,
        livelihood: LoanSettingsSchema
    })
)

// Create default settings
LoanSettings.findOne()
    .lean()
    .then((existing) => {
        if (existing) return

        const settings = new LoanSettings({
            emergency: {
                interest_rate: { unit: '%', value: 0 },
                service_fee: { unit: '%', value: 0, enabled: false },
                capital_build_up: { unit: '%', value: 0, enabled: false },
                savings: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            },
            educational: {
                interest_rate: { unit: '%', value: 0 },
                service_fee: { unit: '%', value: 0, enabled: false },
                capital_build_up: { unit: '%', value: 0, enabled: false },
                savings: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            },
            pettyCash: {
                interest_rate: { unit: '%', value: 0 },
                service_fee: { unit: '%', value: 0, enabled: false },
                capital_build_up: { unit: '%', value: 0, enabled: false },
                savings: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            },
            multipurpose: {
                interest_rate: { unit: '%', value: 0 },
                service_fee: { unit: '%', value: 0, enabled: false },
                capital_build_up: { unit: '%', value: 0, enabled: false },
                savings: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            },
            commercial: {
                interest_rate: { unit: '%', value: 0 },
                service_fee: { unit: '%', value: 0, enabled: false },
                capital_build_up: { unit: '%', value: 0, enabled: false },
                savings: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            },
            livelihood: {
                interest_rate: { unit: '%', value: 0 },
                service_fee: { unit: '%', value: 0, enabled: false },
                capital_build_up: { unit: '%', value: 0, enabled: false },
                savings: { unit: '%', value: 0, enabled: false },
                time: { type: 'months', value: 0 }
            }
        })

        settings.save()
    })

export default LoanSettings

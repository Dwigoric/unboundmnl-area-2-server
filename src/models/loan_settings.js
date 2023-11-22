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
                interest_rate: { unit: 'percentage', value: 0, enabled: false },
                service_fee: { unit: 'percentage', value: 0, enabled: false },
                capital_build_up: { unit: 'percentage', value: 0, enabled: false },
                savings: { unit: 'percentage', value: 0, enabled: false },
                credit_life_insurance: { unit: 'percentage', value: 0, enabled: false }
            },
            educational: {
                interest_rate: { unit: 'percentage', value: 0, enabled: false },
                service_fee: { unit: 'percentage', value: 0, enabled: false },
                capital_build_up: { unit: 'percentage', value: 0, enabled: false },
                savings: { unit: 'percentage', value: 0, enabled: false },
                credit_life_insurance: { unit: 'percentage', value: 0, enabled: false }
            },
            pettyCash: {
                interest_rate: { unit: 'percentage', value: 0, enabled: false },
                service_fee: { unit: 'percentage', value: 0, enabled: false },
                capital_build_up: { unit: 'percentage', value: 0, enabled: false },
                savings: { unit: 'percentage', value: 0, enabled: false },
                credit_life_insurance: { unit: 'percentage', value: 0, enabled: false }
            },
            multipurpose: {
                interest_rate: { unit: 'percentage', value: 0, enabled: false },
                service_fee: { unit: 'percentage', value: 0, enabled: false },
                capital_build_up: { unit: 'percentage', value: 0, enabled: false },
                savings: { unit: 'percentage', value: 0, enabled: false },
                credit_life_insurance: { unit: 'percentage', value: 0, enabled: false }
            },
            commercial: {
                interest_rate: { unit: 'percentage', value: 0, enabled: false },
                service_fee: { unit: 'percentage', value: 0, enabled: false },
                capital_build_up: { unit: 'percentage', value: 0, enabled: false },
                savings: { unit: 'percentage', value: 0, enabled: false },
                credit_life_insurance: { unit: 'percentage', value: 0, enabled: false }
            },
            livelihood: {
                interest_rate: { unit: 'percentage', value: 0, enabled: false },
                service_fee: { unit: 'percentage', value: 0, enabled: false },
                capital_build_up: { unit: 'percentage', value: 0, enabled: false },
                savings: { unit: 'percentage', value: 0, enabled: false },
                credit_life_insurance: { unit: 'percentage', value: 0, enabled: false }
            }
        })

        settings.save()
    })

export default LoanSettings

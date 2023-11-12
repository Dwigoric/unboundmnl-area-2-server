// Packages
import { Schema, model } from 'mongoose'

// Import schema
import LoanSettingsSchema from './loanSettingsSchema.js'

const LoanSettings = model(
    'loanSettings',
    new Schema({
        emergency: LoanSettingsSchema,
        educational: LoanSettingsSchema,
        pettyCash: LoanSettingsSchema,
        multipurpose: LoanSettingsSchema,
        commercial: LoanSettingsSchema,
        livelihood: LoanSettingsSchema
    })
)

export default LoanSettings

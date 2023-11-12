// Packages
import { Schema, model } from 'mongoose'

// Import schema
import DepositSettingsSchema from './depositSettingsSchema.js'

const DepositSettings = model(
    'depositSettings',
    new Schema({
        shareCapital: DepositSettingsSchema,
        savings: DepositSettingsSchema,
        timeDeposit: DepositSettingsSchema
    })
)

export default DepositSettings

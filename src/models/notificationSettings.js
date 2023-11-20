// Packages
import { Schema, model } from 'mongoose'

const NotificationSettingsSchema = new Schema({
    notification_period_1: Number,
    notification_period_2: Number,
    notification_period_3: Number
})

const NotificationSettings = new model('NotificationSettings', NotificationSettingsSchema)

export default NotificationSettings

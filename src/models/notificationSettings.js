// Packages
import { Schema, model } from 'mongoose'

const NotificationSettingsSchema = new Schema({
    notification_period_1: Number,
    notification_period_2: Number,
    notification_period_3: Number
})

const NotificationSettings = new model('NotificationSettings', NotificationSettingsSchema)

// Create default settings
NotificationSettings.findOne()
    .lean()
    .then((existing) => {
        if (existing) return

        const settings = new NotificationSettings({
            notification_period_1: 3,
            notification_period_2: 5,
            notification_period_3: 7
        })

        settings.save()
    })

export default NotificationSettings

/**
 * Model to represent the settings for overdue loan warning colors.
 * @module models/notificationSettings
 */

// Packages
import { Schema, model } from 'mongoose'

const NotificationSettingsSchema = new Schema({
    notification_period_1: Number,
    notification_period_2: Number,
    notification_period_3: Number
})

/**
 * Model to represent deposit settings for a single deposit category.
 *
 * @prop {Number} notification_period_1 - How close to the deadline a loan has to be for its entry to turn red.
 * @prop {Number} notification_period_2 - How close to the deadline a loan has to be for its entry to turn orange.
 * @prop {Number} notification_period_3 - How close to the deadline a loan has to be for its entry to turn blue.
 */
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

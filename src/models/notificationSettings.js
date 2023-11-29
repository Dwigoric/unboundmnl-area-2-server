/**
 * Model to represent the settings for overdue loan warning colors.
 * @module models/notificationSettings
 */

// Packages
import { Schema, model } from 'mongoose'

const NotificationSettingsSchema = new Schema({
    reminder: Number,
    first_notice: Number,
    second_notice: Number,
    third_notice: Number,
    demand_letter: Number
})

/**
 * Model to represent notification settings.
 *
 * @prop {Number} reminder - How close to the deadline a loan has to be for it to warrant a reminder.
 * @prop {Number} first_notice - How close to the deadline a loan has to be for it to warrant a first notice.
 * @prop {Number} second_notice - How close to the deadline a loan has to be for it to warrant a second notice.
 * @prop {Number} third_notice - How close to the deadline a loan has to be for it to warrant a third notice.
 * @prop {Number} demand_letter - How close to the deadline a loan has to be for it to warrant a demand letter.
 */
const NotificationSettings = new model('NotificationSettings', NotificationSettingsSchema)

// Create default settings
NotificationSettings.findOne()
    .lean()
    .then((existing) => {
        if (existing) return

        const settings = new NotificationSettings({
            reminder: 14,
            first_notice: 7,
            second_notice: 5,
            third_notice: 3,
            demand_letter: 1
        })
        settings.save()
    })

export default NotificationSettings

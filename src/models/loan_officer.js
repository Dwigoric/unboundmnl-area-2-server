// Import packages
import { Schema, model } from 'mongoose'
import { v5 as uuidV5, validate as uuidValidate, version as uuidVersion } from 'uuid'

// Import schema
import NameSchema from './nameSchema.js'

const LoanOfficerSchema = new Schema({
    active: {
        type: Boolean,
        default: true,
        index: 1
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        validate: {
            validator: (username) => {
                const regex = /^[a-zA-Z0-9_]{6,20}$/
                return regex.test(username)
            },
            message:
                'Username must be between 6 and 20 characters and contain only letters, numbers, and underscores'
        }
    },
    password_hash: {
        type: String,
        required: [true, 'Password is required']
    },
    id: {
        type: String,
        unique: true,
        immutable: true,
        validate: {
            validator: (uuid) => uuidValidate(uuid) && uuidVersion(uuid) === 5,
            message: 'UUID must be a valid UUID'
        }
    },
    name: {
        type: NameSchema,
        required: [true, 'Name is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['manager', 'treasurer', 'credit committee']
    }
})

// This middleware's methods matches all queries that start with 'find'
LoanOfficerSchema.pre(/^find/, () => {
    this.where({ active: { $ne: false } })
})

LoanOfficerSchema.pre('save', (next) => {
    if (this.isNew) this.id = uuidV5(Date.now().toString(), uuidV5.URL)
    next()
})

const LoanOfficer = model('LoanOfficer', LoanOfficerSchema)

export default LoanOfficer

// Import packages
import { Schema, model } from 'mongoose'
import { validate as uuidValidate, version as uuidVersion } from 'uuid'

// Import schema
import NameSchema from './nameSchema.js'

const LoanOfficer = model(
    'LoanOfficer',
    new Schema({
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
        uuid: {
            type: String,
            unique: true,
            required: [true, 'UUID is required'],
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
)

export default LoanOfficer

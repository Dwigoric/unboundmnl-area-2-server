// Import packages
import { Schema, model } from 'mongoose'
import argon2 from 'argon2'
import { v5 as uuidV5, validate as uuidValidate, version as uuidVersion } from 'uuid'

const Admin = model(
    'Admin',
    new Schema({
        username: {
            type: String,
            unique: true,
            immutable: true,
            default: 'admin',
            validate: {
                validator: (username) => {
                    return username === 'admin'
                },
                message: 'Username must be "admin"'
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
            default: () => uuidV5('admin', uuidV5.URL),
            validate: {
                validator: (uuid) => uuidValidate(uuid) && uuidVersion(uuid) === 5,
                message: 'UUID must be a valid UUID'
            }
        }
    })
)

// Create a new admin if one does not exist
Admin.findOne({ username: 'admin' }, 'username')
    .lean()
    .then(async (existing) => {
        if (!existing) {
            const password_hash = await argon2.hash('admin')

            const admin = new Admin({
                username: 'admin',
                password_hash
            })

            admin.save()
        }
    })

export default Admin

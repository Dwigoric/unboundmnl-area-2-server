// Import packages
import { Schema, model } from 'mongoose'

const Admin = model(
    'Admin',
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
                validator: (uuid) => {
                    const regex = /^[a-zA-Z0-9]{8}-([a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]{12}$/
                    return regex.test(uuid)
                },
                message: 'UUID must be a valid UUID'
            }
        }
    })
)

await Admin.init()
export default Admin

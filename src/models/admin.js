// Import packages
import { Schema, model } from 'mongoose'

// Import schema
import NameSchema from './nameSchema.js'

const Admin = model(
    'Admin',
    new Schema({
        username: {
            type: String,
            unique: true,
            required: [true, 'Username is required']
        },
        password_hash: {
            type: String,
            required: [true, 'Password is required']
        },
        uuid: {
            type: String,
            unique: true,
            required: [true, 'UUID is required']
        },
        name: {
            type: NameSchema,
            required: [true, 'Name is required']
        }
    })
)

await Admin.init()
export default Admin

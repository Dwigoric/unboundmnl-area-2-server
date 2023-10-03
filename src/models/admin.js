import { Schema, model } from 'mongoose'

export const Admin = model(
    'Admin',
    new Schema({
        username: String,
        password_hash: String,
        uuid: String
    })
)

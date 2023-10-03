import { Schema, model } from 'mongoose'

const Admin = model(
    'Admin',
    new Schema({
        username: String,
        password_hash: String,
        uuid: String
    })
)

export default Admin

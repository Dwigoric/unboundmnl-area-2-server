import { Schema, model } from 'mongoose'

export const LoanOfficer = model(
    'LoanOfficer',
    new Schema({
        username: String,
        password_hash: String,
        uuid: String
    })
)

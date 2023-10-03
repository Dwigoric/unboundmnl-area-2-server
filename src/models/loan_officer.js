import { Schema, model } from 'mongoose'

const LoanOfficer = model(
    'LoanOfficer',
    new Schema({
        username: String,
        password_hash: String,
        uuid: String
    })
)

export default LoanOfficer

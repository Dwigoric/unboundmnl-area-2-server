import { Schema, model } from 'mongoose'
import NameSchema from './nameSchema.js'
import SpouseSchema from './spouseSchema.js'

const Loanee = model(
    "Loanee",
    new Schema({
        username: {type: String, required: true, unique: true},
        name: {type: NameSchema, required: true},
        birthday: {type: Date, required: true},
        birthplace: {type: String, required: true},
        gender: {type: String, enum: ['M', 'F'], required: true},
        civil_status: {type: String, enum: ["Single", "Married"], required: true},
        tin_no: {type: String, required: true},
        contact_no: {type: String, required: true},
        monthly_income: {type: Number, required: true, min: 0},
        address: {type: String, required: true},
        occupation: {type: String, required: true},
        spouse: {type: SpouseSchema}
        // loans: [Loan]
    })
)

export default Loanee
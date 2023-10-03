import { Schema, model } from 'mongoose'

const Loanee = model(
    "Loanee",
    new Schema({
        username: {type: String, required: true},
        name: {
            given: {type: String, required: true},
            middle: String,
            last: {type: String, required: true}
        },
        birthday: {type: Date, required: true},
        birthplace: {type: String, required: true},
        gender: {type: String, enum: ['M', 'F'], required: true},
        civil_status: {type: String, enum: ["Single", "Married"], required: true},
        tin_no: {type: String, required: true},
        contact_no: {type: String, required: true},
        monthly_income: {type: Number, required: true},
        address: {type: String, required: true},
        occupation: {type: String, required: true},
        spouse: {
            name: {
                given: String,
                middle: String,
                last: String
            },
            birthday: String,
            birthplace: String,
            contact_no: String
        }
        // loans: [Loan]
    })
)

export default Loanee
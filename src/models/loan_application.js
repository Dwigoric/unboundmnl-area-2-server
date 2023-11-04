// import { Schema, model } from 'mongoose'

// const LoanApplication = model(
//     'LoanApplication',
//     new Schema({
//         loanee: {
//             type: Schema.Types.ObjectId,
//             ref: 'Loanee',
//             required: true
//         },
//         date: {
//             type: Date,
//             default: Date.now,
//             required: [true, 'Date is required']
//         },
//         amount: {
//             type: Number,
//             required: [true, 'Amount is required']
//         },
//         term: {
//             type: Number,
//             required: [true, 'Term is required']
//         },
//         new: {
//             type: Boolean,
//             required: [true, 'Indicate whether this is a new loan or a renewal']
//         },
//         renewal: {
//             type: Boolean,
//             required: [true, 'Indicate whether this is a new loan or a renewal']
//         },
//         type: {
//             type: String,
//             enum: ['education', 'personal', 'micro', 'utility', 'house', 'emergency', 'commodity'],
//             required: [true, 'Loan type is required']
//         },
//         status: {
//             type: String,
//             enum: ['pending', 'approved', 'rejected'],
//             default: 'pending',
//             required: [true, 'Status is required']
//         }
//     })
// )

// export default LoanApplication

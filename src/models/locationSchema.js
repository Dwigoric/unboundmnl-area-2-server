import { Schema } from 'mongoose'

const LocationSchema = new Schema({
    street: {type: String, required: [true, 'Street is required']},
    barangay: {type: String, required: [true, 'Barangay is required']},
    city: {type: String, required: [true, 'City is required']},
    province: {type: String, required: [true, 'Province is required']}
})

export default LocationSchema
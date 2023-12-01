/**
 * Schema for representing a location in the Philippines.
 * @module models/locationSchema
 */
import { Schema } from 'mongoose'

/**
 * Schema for representing a location in the Philippines.
 *
 * @prop {String} street - Street of location. Ex. Taft Avenue
 * @prop {String} barangay - Barangay of location. Ex. 2401
 * @prop {String} city - City of location. Ex. Manila City
 * @prop {String} province - Province of location. Ex. Metro Manila
 * @prop {String} region - Region of location. Ex. National Capital Region (NCR)
 */
const LocationSchema = new Schema({
    street: { type: String, required: [true, 'Street is required'] },
    barangay: { type: String, required: [true, 'Barangay is required'] },
    city: { type: String, required: [true, 'City is required'] },
    province: { type: String, required: [true, 'Province is required'] },
    region: { type: String, required: [true, 'Region is required'] }
})

export default LocationSchema

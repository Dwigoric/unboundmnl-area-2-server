/**
 * Module for storing the default URI of the MongoDB instance. Primarily used for testing.
 * @module db/default_uri
 */

/**
 * Default MongoDB URI
 * This is the MongoDB URI that is used if the MONGODB_URI environment variable is not set in .env
 * @const
 */
export const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/unboundmnl-problem-area-2'

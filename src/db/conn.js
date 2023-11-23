import mongoose from 'mongoose'

// Default MongoDB URI
const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/unboundmnl-problem-area-2'

class Database {
    /**
     * Initialize the database connection
     * @returns {Promise<Mongoose>}
     */
    init() {
        // Warn if MONGODB_URI is not set
        if (!process.env.MONGODB_URI)
            console.warn(`MONGODB_URI not set, using default: ${DEFAULT_MONGODB_URI}`)

        // Set the MongoDB URI
        const url = process.env.MONGODB_URI || DEFAULT_MONGODB_URI

        return mongoose.connect(url)
        // Do not catch the error; the app should crash on database connection failure
    }

    /**
     * Close the database connection
     * @returns {Promise<void>}
     */
    close() {
        return mongoose.connection.close()
    }
}

const database = new Database()

export default database

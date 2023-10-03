import mongoose from 'mongoose'
const url = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/'

class Database {
    /**
     * Initialize the database connection
     * @returns {Promise<Mongoose>}
     */
    init() {
        return mongoose.connect(url).then(() => {
            console.log('Database connection successful')
        })
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

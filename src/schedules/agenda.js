// Packages
import { Agenda } from '@hokify/agenda'
import mongoose from 'mongoose'

// Configure Agenda
const agenda = new Agenda({
    ensureIndex: true,
    processEvery: '1 minute',
    mongo: mongoose.connection
})

// Import jobs
import jobs from './jobs/index.js'

// Define jobs
for (const jobInfo of Object.values(jobs)) agenda.define(jobInfo.name, jobInfo.handler)

const graceful = async () => {
    await agenda.stop()
    process.exit(0)
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)

async function start() {
    await agenda.start()
    for (const jobInfo of Object.values(jobs)) await agenda.every(jobInfo.every, jobInfo.name)
}
await start()

export default agenda

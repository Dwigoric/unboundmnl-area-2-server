// Packages
import { Agenda } from '@hokify/agenda'

// Default MongoDB URI
import { DEFAULT_MONGODB_URI } from '../db/default_uri.js'

// Configure Agenda
const agenda = new Agenda({
    ensureIndex: true,
    processEvery: '10 minutes',
    db: { address: process.env.MONGODB_URI || DEFAULT_MONGODB_URI }
    // TODO: Use existing mongoose connection
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
    for (const jobInfo of Object.values(jobs))
        if (jobInfo.every) await agenda.every(jobInfo.every, jobInfo.name)
}
await start()

export default agenda

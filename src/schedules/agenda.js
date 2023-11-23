// Packages
import Agenda from 'agenda'
import mongoose from 'mongoose'

const agenda = new Agenda()

agenda.mongo(mongoose.connection, 'agenda-jobs')

// Import jobs
import jobs from './jobs/index.js'

// Define jobs
for (const job in jobs) agenda.define(job.name, job.handler)

export default agenda

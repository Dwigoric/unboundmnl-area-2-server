const name = 'process-loan-interests'

const handler = async (job, done) => {
    const { Loan } = job.context.models

    // TODO: Process loan interests

    done()
}

const every = '5 seconds' // Every 12:00 AM

export default { name, handler, every }

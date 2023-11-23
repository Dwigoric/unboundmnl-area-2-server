const name = 'process-loan-interests'

const handler = async (job, done) => {
    const { Loan } = job.context.models

    // TODO: Process loan interests

    done()
}

export default { name, handler }

const name = 'process-loan-interests'

const handler = async (job, done) => {
    console.log('i ran!')

    const { Loan } = job.context.models

    // TODO: Process loan interests

    done()
}

const every = '* * * * *'

export default { name, handler, every }

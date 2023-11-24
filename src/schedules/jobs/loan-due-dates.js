// Schema
import Loan from '../../models/loan.js'

const name = 'extend-loan-due-dates'

const handler = async (job, done) => {
    const loans = await Loan.find({ dueDate: { $lt: new Date() } }).lean()

    // Iterate through loans
    for (const rawLoan of loans) {
        const loan = await rawLoan
        if (!loan.isPaidForCurrentPeriod) {
            // TODO: Add a transaction for penalty
            continue
        }

        // Extend due date
        const dueDate = new Date(loan.dueDate)
        dueDate.setDate(dueDate.getDate() + 1)
        if (loan.paymentFrequency === 'weekly') {
            dueDate.setDate(dueDate.getDate() + 6)
        } else if (loan.paymentFrequency === 'months') {
            dueDate.setMonth(dueDate.getMonth() + 1)
            dueDate.setDate(dueDate.getDate() - 1)
        }

        // Update loan
        await Loan.updateOne({ loanID: loan.loanID }, { dueDate, isPaidForCurrentPeriod: false })
    }

    done()
}

const every = '0 0 * * *' // Every 12:00 AM

export default { name, handler, every }

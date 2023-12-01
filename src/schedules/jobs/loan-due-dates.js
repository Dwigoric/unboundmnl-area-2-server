/**
 * Module implementing Agenda jobs for managing loan payment due dates.
 * @module schedules/jobs/loan-due-dates
 */

// Schema
import Loan from '../../models/loan.js'

const name = 'extend-loan-due-dates'

/**
 * Handler that updates all loans' due dates on callback.
 * If a loan is paid for the current loan period, and the current date is beyond
 * the due date, updates the due date based on the loan's payment frequency and
 * re-flags it as unpaid for this loan period.
 */
const handler = async (job, done) => {
    const loans = await Loan.find({ dueDate: { $lt: new Date() } }).lean()

    // Iterate through loans
    for (const loan of loans) {
        if (!loan.isPaidForCurrentPeriod) continue

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

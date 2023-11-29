/**
 * Module implementing an Agenda job for regular calculation of loan interests.
 * @module schedules/jobs/loan-interests
 */

import Loan from '../../models/loan.js'
import LoanSettings from '../../models/loanSettings.js'
import Decimal from 'decimal.js'

import moment from 'moment'
moment().format()

import parseDecimal from '../../modules/decimal/parseDecimal.js'
import round2 from '../../modules/decimal/round2.js'

const name = 'process-loan-interests'

/**
 * Handler that updates every loan's interests on callback.
 * Updates every loan that is active and currently due for interest.
 */
const handler = async (job, done) => {
    console.log('Updating loan interests...')

    const loans = await Loan.find({
        nextInterestDate: {
            $lte: Date.now()
        }
    }).lean()
    parseDecimal(loans)

    const allSettings = await LoanSettings.findOne().lean()
    parseDecimal(allSettings)

    for (const loan of loans) {
        const loanSettings = allSettings[loan.loanType]
        let interest = Decimal('0')

        if (loanSettings.interest_rate.unit === 'Fixed') {
            interest = interest.add(loanSettings.interest_rate.value)
        } else {
            interest = interest.add(
                Decimal(loanSettings.interest_rate.value).mul('0.01').mul(loan.balance)
            )
        }

        const newBalance = round2(interest.add(loan.balance))
        interest = round2(interest)

        const transaction = {
            transactionID: Date.now().toString(36).toUpperCase(),
            transactionDate: Date.now(),
            submissionDate: Date.now(),
            amountPaid: 0,
            amountDue: 0,
            balance: parseFloat(newBalance),
            interestPaid: 0,
            interestDue: parseFloat(interest),
            finesDue: 0,
            finesPaid: 0,
            officerInCharge: {
                given: 'Admin',
                middle: '',
                last: ' '
            }
        }

        const timeConversions = {
            days: 1,
            months: 30,
            years: 365
        }
        const nextInterestDate = moment(loan.nextInterestDate)
            .add(loanSettings.time.value * timeConversions[loanSettings.time.type], 'days')
            .set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            })
            .toDate()

        const query = {
            $push: { ledger: transaction },
            $set: {
                balance: parseFloat(newBalance),
                nextInterestDate: nextInterestDate
            }
        }

        await Loan.updateOne({ loanID: loan.loanID }, query, {
            runValidators: true
        })
    }

    console.log(`Successfully updated ${loans.length} loan interests.`)

    done()
}

const every = '0 1 * * *' // Every 1:00 AM (to avoid desync problems with date checks)
// const every = '5 seconds'
export default { name, handler, every }

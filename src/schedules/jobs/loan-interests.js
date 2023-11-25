import Loan from '../../models/loan.js'
import LoanSettings from '../../models/loan_settings.js'
import Decimal from 'decimal.js'

import moment from 'moment'
moment().format()

const name = 'process-loan-interests'

const handler = async (job, done) => {
    const loans = await Loan.find({
        nextInterestDate: {
            $lte: Date.now()
        }
    }).lean()
    parseDecimal(loans)

    const allSettings = await LoanSettings.findOne().lean()
    parseDecimal(allSettings)

    console.log('Updating loan interests...')

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

// https://stackoverflow.com/questions/53369688/extract-decimal-from-decimal128-with-mongoose-mongodb
const parseDecimal = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
        if (v.constructor.name === 'Decimal128') prev[i] = parseFloat(v.toString())
        else
            Object.entries(v).forEach(([key, value]) =>
                parseDecimal(value, key, prev ? prev[i] : v)
            )
    }
}

const round2 = function (decimal) {
    return decimal.mul('100').round().mul('0.01')
}

const every = '0 1 * * *' // Every 1:00 AM (to avoid desync problems with date checks)
// const every = '5 seconds'
export default { name, handler, every }

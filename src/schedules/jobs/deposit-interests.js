/**
 * Module implementing an Agenda job for regular calculation of deposit interests.
 * @module schedules/jobs/deposit-interests
 */

import Deposit from '../../models/deposit.js'
import DepositSettings from '../../models/depositSettings.js'
import Decimal from 'decimal.js'

import moment from 'moment'
moment().format()

import parseDecimal from '../../modules/decimal/parseDecimal.js'
import round2 from '../../modules/decimal/round2.js'

const name = 'process-deposit-interests'

/**
 * Handler that updates every deposit's interests on callback.
 * Updates every deposit that is active and currently due for interest.
 */
const handler = async (job, done) => {
    console.log('Updating deposit interests...')

    const deposits = await Deposit.find({
        nextInterestDate: {
            $lte: Date.now()
        }
    }).lean()
    parseDecimal(deposits)

    const allSettings = await DepositSettings.findOne().lean()
    parseDecimal(allSettings)

    for (const deposit of deposits) {
        const depositSettings = allSettings[deposit.category]
        let interest = Decimal('0')

        if (depositSettings.interest_rate.unit === 'Fixed') {
            interest = interest.add(depositSettings.interest_rate.value)
        } else {
            interest = interest.add(
                Decimal(depositSettings.interest_rate.value).mul('0.01').mul(deposit.runningAmount)
            )
        }

        const newBalance = round2(interest.add(deposit.runningAmount))
        interest = round2(interest)
        const submissionDate = Date.now()

        const transaction = {
            transactionID: Date.now().toString(36).toUpperCase(),
            transactionDate: Date.now(),
            submissionDate: submissionDate,
            transactionType: 'Deposit',
            amount: 0,
            interest: parseFloat(interest),
            balance: parseFloat(newBalance),
            officerInCharge: {
                given: 'Admin',
                middle: '',
                last: ' '
            }
        }

        const timeSetting = depositSettings.time

        const timeConversions = {
            days: 1,
            months: 30,
            years: 365
        }
        const nextInterestDate = moment(deposit.nextInterestDate)
            .add(timeSetting.value * timeConversions[timeSetting.type], 'days')
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
                runningAmount: parseFloat(newBalance),
                nextInterestDate: nextInterestDate
            }
        }

        await Deposit.updateOne({ depositID: deposit.depositID }, query, {
            runValidators: true
        })
    }

    console.log(`Successfully updated ${deposits.length} deposit interests.`)

    done()
}

const every = '0 1 * * *' // Every 1:00 AM (to avoid desync problems with date checks)
// const every = '5 seconds'
export default { name, handler, every }

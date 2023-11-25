import Deposit from '../../models/deposit.js'
import DepositSettings from '../../models/deposit_settings.js'
import Decimal from 'decimal.js'

import moment from 'moment'
moment().format()

const name = 'process-deposit-interests'

const handler = async (job, done) => {
    console.log('Updating deposit interests...')

    const deposits = await Deposit.find({})

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

// const every = '0 1 * * *' // Every 1:00 AM (to avoid desync problems with date checks)
const every = '5 seconds'
export default { name, handler, every }

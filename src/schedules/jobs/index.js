/**
 * Index for Agenda jobs
 * @module schedules/jobs/index
 * @exports loanInterests
 * @exports loanDueDates
 * @exports depositInterests
 */

import loanInterests from './loan-interests.js'
import loanDueDates from './loan-due-dates.js'
import depositInterests from './deposit-interests.js'

export default {
    loanInterests,
    loanDueDates,
    depositInterests
}

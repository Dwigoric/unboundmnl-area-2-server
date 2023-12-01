/**
 * @module modules/decimal/round2
 * @export round2
 * @requires decimal.js
 */

/**
 * Rounds off a decimal.js decimal to 2 places.
 * Used for financial calculations.
 *
 * @param {decimal.Decimal} decimal - The decimal instance to round off.
 * @return The input decimal rounded off to 2 decimal places
 */
const round2 = function (decimal) {
    return decimal.mul('100').round().mul('0.01')
}

export default round2

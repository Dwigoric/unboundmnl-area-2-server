/**
 * @module modules/conversions/parseDecimal
 * @export parseDecimal
 */

/**
 * Convert all Decimal128 instances in an object to floats in-place. Primarily used to preprocess raw mongoose query outputs.
 * Intended usage is to call only with a single parameter `v`.
 * Credits to https://stackoverflow.com/questions/53369688/extract-decimal-from-decimal128-with-mongoose-mongodb
 *
 * @param {Object} v - Object to be converted
 * @param {Object} i - Parent object key to convert object in-place. Used only for recursive calls, and should be null.
 * @param {Object} prev - Parent object from last recursive call. Used only for recursive calls, and should be null.
 *
 */
const parseDecimal = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
        if (v.constructor.name === 'Decimal128') prev[i] = parseFloat(v)
        else
            Object.entries(v).forEach(([key, value]) =>
                parseDecimal(value, key, prev ? prev[i] : v)
            )
    }
}

export default parseDecimal

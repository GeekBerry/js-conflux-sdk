const Big = require('big.js');

const UNIT_MATRIX = {
  CFX: { CFX: 1, GDrip: 1e9, Drip: 1e18 },
  GDrip: { CFX: 1e-9, GDrip: 1, Drip: 1e9 },
  Drip: { CFX: 1e-18, GDrip: 1e-9, Drip: 1 },
};

/**
 * Unit converter factory
 *
 * @param from {string} - Enum in ['CFX', 'GDrip', 'Drip']
 * @param to {string} - Enum in ['CFX', 'GDrip', 'Drip']
 * @return {function}
 *
 * @example
 * > unit('CFX', 'Drip')(1)
 "1000000000000000000"

 * > unit('Drip', 'CFX')(1000000000000000000)
 "1"
 */
function unit(from, to) {
  const keys = Object.keys(UNIT_MATRIX);
  if (!keys.includes(from)) {
    throw new Error(`"from" must in ${JSON.stringify(keys)}, got "${from}"`);
  }
  if (!keys.includes(to)) {
    throw new Error(`"to" must in ${JSON.stringify(keys)}, got "${to}"`);
  }

  const multiple = UNIT_MATRIX[from][to];

  return value => Big(value).times(multiple).toFixed();
}

// ----------------------------------------------------------------------------
/**
 * @param value {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromCFXToGDrip(123)
 "123000000000"
 */
unit.fromCFXToGDrip = unit('CFX', 'GDrip');

/**
 * @param value {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromCFXToDrip(123)
 "123000000000000000000"
 */
unit.fromCFXToDrip = unit('CFX', 'Drip');

/**
 * @param value {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromGDripToCFX(123000000000)
 "123"
 */
unit.fromGDripToCFX = unit('GDrip', 'CFX');

/**
 * @param value {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromGDripToDrip(123)
 "123000000000"
 */
unit.fromGDripToDrip = unit('GDrip', 'Drip');

/**
 * @param value {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromDripToCFX(123000000000000000000)
 "123"
 */
unit.fromDripToCFX = unit('Drip', 'CFX');

/**
 * @param value {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromDripToGDrip(123000000000)
 "123"
 */
unit.fromDripToGDrip = unit('Drip', 'GDrip');

module.exports = unit;

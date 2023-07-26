/**
 *  Utility to generate random string
 */

const randomstring = require('randomstring');

/**
 * Generates an Entropy that is used to generate an Ether random wallet.
 */
const entropy = () => randomstring.generate(32);

module.exports = {
  entropy,
};

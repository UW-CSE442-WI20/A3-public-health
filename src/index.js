/**
 * Using a bundler let's us import
 * third party libraries and our own modules
 * using the "require()" or "import * from 'X'"
 * syntax.
 */

const d3 = require('d3');
const myUtilityFunc = require('./utility-funcs');

console.log('This function was imported from another file.', myUtilityFunc(2));

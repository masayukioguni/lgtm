'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

var _ = require('lodash');

/**
 * Load environment configuration
 */
module.exports = _.extend(
    require('./env/all.js'),
    require('./env/' + process.env.NODE_ENV + '.js') || {}
);
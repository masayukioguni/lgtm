'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

module.exports = {
    env: 'test',
    mongo: {
        uri: 'mongodb://localhost/fullstack-test'
    },
    app_root: 'app'
};
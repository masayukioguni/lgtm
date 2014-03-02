'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

module.exports = {
    env: 'development',
    mongo: {
        uri: 'mongodb://localhost/fullstack-dev'
    },
    image_width: 250,
    font_size: 68,
    app_host: 'http://localhost:9000',
    app_root: 'app',
    upload_dir: 'images'
};
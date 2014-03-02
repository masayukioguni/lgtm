'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

module.exports = {
    env: 'production',
    mongo: {
        uri: process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            'mongodb://localhost/fullstack'
    },
    image_width: 250,
    font_size: 68,
    app_host: process.env.LGTM_APP_HOST || 'http://localhost:9000',
    app_root: 'public',
    upload_dir: 'images'
};
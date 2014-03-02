'use strict';

var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },
    image_width: process.env.LGTM_IMAGE_SIZE || 250,
    font_size: process.env.LGTM_FONT_SIZE || 68,
    app_host: process.env.LGTM_APP_HOST || 'http://localhost:9000',
    upload_dir: process.env.LGTM_UPLOAD_DIR || 'images'
};
'use strict';

module.exports = {
    env: 'development',
    mongo: {
        uri: 'mongodb://localhost/fullstack-dev'
    },
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    s3_bucket: "lgtmtest",
    s3_resion: 'us-west-2',
    s3_url: 'https://s3-us-west-2.amazonaws.com',
    image_width: 250,
    font_size: 68,
    app_host: 'http://localhost:9000',
    app_root: 'app',
    upload_dir: 'images'
};
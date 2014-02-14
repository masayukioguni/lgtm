'use strict';

module.exports = {
    env: 'development',
    mongo: {
        uri: 'mongodb://localhost/fullstack-dev'
    },
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    s3_bucket: process.env.S3_BUCKET_NAME,
    s3_resion: 'us-west-2',
    s3_url: 'https://s3-us-west-2.amazonaws.com',
    image_width: 250,
    font_size: 68
};
'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    s3client = require('knox'),
    gm = require('gm'),
    async = require('async'),
    fs = require('fs'),
    imageSize = require('image-size'),
    config = require('../config/config'),
    util = require('util');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
    return Thing.find(function(err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

var getImageUrl = function(name) {
    return util.format('%s/%s/%s', config.s3_url, config.s3_bucket, name);
};

var getImageSavePath = function(targetDir, name) {
    var path = require('path');
    var absPath = path.resolve(path.join(config.app_root, config.upload_dir));
    return util.format('%s/%s/%s', absPath, targetDir, name);
};

var getImageLoadPath = function(targetDir, name) {
    return util.format('%s/%s/%s/%s', config.app_host, config.upload_dir, targetDir, name);
};


exports.image = function(req, res) {
    var id = req.route.params.id;
    return mongoose.model('Image').find({
            _id: id
        },
        function(err, images) {
            if (!err) {
                var response = {};
                if (images.length !== 1) {
                    return res.send('image not found', 404);
                } else {
                    var image = images[0];
                    response.name = image.name;
                    response.src = getImageLoadPath('lgtm', image.name);
                    return res.json(response);
                }
            } else {
                console.log("exports.image error");
                return res.send('image not found', 404);
            }
        });
};

exports.images = function(req, res) {
    mongoose.model('Image').find({}).sort({
        updated_at: 'desc'
    }).exec(function(err, images) {
        if (!err) {
            var response = [];
            images.forEach(function(image) {
                response.push({
                    'id': image._id,
                    'src': getImageLoadPath('lgtm', image.name),
                    'name': image.name
                });
            });
            console.log(response);
            return res.json(response);
        } else {
            return res.send(err);
        }
    });
};

exports.createImage = function(req, res) {
    var Image = mongoose.model('Image');
    var orgName = req.files.file.originalFilename;
    var path = req.files.file.path;
    var length = req.files.file.size;
    var type = 'image/jpeg';

    async.waterfall([

            function(callback) {
                var resizeFileName = getImageSavePath('resize', orgName);
                var width = config.image_width;

                console.log('image resize start path' + path + ' -> ' + resizeFileName);

                gm(req.files.file.path)
                    .resize(width)
                    .write(resizeFileName, function(err) {
                        if (err)
                            return console.log(arguments);
                        console.log(this.outname + ' created  :: ' + arguments[3]);
                        console.log('image resize end');
                        callback(null, resizeFileName);

                    });
            },
            function(resizeFileName, callback) {
                var lgtmFileName = getImageSavePath('lgtm', orgName);
                console.log('image lgtm start path' + resizeFileName + ' -> ' + lgtmFileName);
                var fontSize = config.font_size;
                var dimensions = imageSize(resizeFileName);
                var x = dimensions.width - 200;
                var y = dimensions.height - 10;

                gm(resizeFileName)
                    .fontSize(fontSize)
                    .stroke("#efe", 1)
                    .fill("#555")
                    .drawText(x, y, "LGTM")
                    .write(lgtmFileName, function(err) {
                        if (err)
                            return console.log(arguments);

                        console.log(this.outname + ' created  :: ' + arguments[3]);
                        console.log('image lgtm end');
                        callback(null, lgtmFileName);
                    });
            },
            function(lgtmFileName, callback) {
                console.log('image s3 upload start path' + lgtmFileName + ' -> ' + getImageUrl(orgName));
                var client = s3client.createClient({
                    key: config.aws_access_key_id,
                    secret: config.aws_secret_access_key,
                    bucket: config.s3_bucket,
                    region: config.s3_resion
                });

                var stat = fs.statSync(lgtmFileName);
                client.putFile(lgtmFileName, orgName, {
                    'Content-Length': stat.size,
                    'Content-Type': type,
                    'x-amz-acl': 'public-read'
                }, function(err, s3res) {
                    console.log('image s3 upload end');
                    callback(null, 3);
                });
            },
            function(arg, callback) {
                console.log('image create record start');
                new Image({
                    name: orgName,
                    url: orgName
                }).save(function() {
                    console.log('image create record end');
                    callback(null, 4);
                });
            }
        ],
        function(err, results) {
            if (err) {
                throw err;
            }
            console.log('all done');
            console.log(results);

        });
    res.end();
};

exports.deleteImage = function(req, res) {
    console.log(req.route.params.id);
    var id = req.route.params.id;
    async.waterfall([

            function(callback) {
                mongoose.model('Image').find({
                        _id: id
                    },
                    function(err, images) {
                        if (!err) {
                            if (images.length === 1) {
                                var image = images[0];
                                callback(null, image);
                            } else {
                                callback(null, null);
                            }
                        } else {
                            console.log('id not found');
                            callback('id not found', null);
                        }
                    }
                );
            },
            function(image, callback) {
                console.log(image);
                if (image !== null) {
                    var client = s3client.createClient({
                        key: config.aws_access_key_id,
                        secret: config.aws_secret_access_key,
                        bucket: config.s3_bucket,
                        region: config.s3_resion
                    });
                    client.del(image.name).on('response', function(res) {
                        console.log(res.statusCode);
                        console.log(res.headers);
                        callback(null, image);
                    }).end();
                } else {
                    callback(null, null);
                }
            },
            function(image, callback) {
                if (image !== null) {
                    mongoose.model('Image').remove({
                            _id: image._id
                        },
                        function(err) {
                            if (!err) {
                                console.log('delete success');
                                callback(null, null);
                            } else {
                                console.log('id not found');
                                callback('id not found', null);
                            }
                        }
                    );
                } else {
                    callback(null, null);
                }
            },
        ],
        function(err, results) {
            if (err) {
                throw err;
            }
            console.log('all done');
            console.log(results);
        });
    res.end();
};
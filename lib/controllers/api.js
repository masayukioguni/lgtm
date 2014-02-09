'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    s3client = require('knox'),
    gm = require('gm'),
    async = require('async'),
    fs = require('fs'),
    imageSize = require('image-size');

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

exports.images = function(req, res) {
    mongoose.model('Image').find({}).sort({
        updated_at: 'desc'
    }).exec(function(err, images) {
        if (!err) {
            images.forEach(function(image) {
                image.url = "https://s3-us-west-2.amazonaws.com/lgtmtest/lgtm_" + image.url;
            });

            return res.json(images);
        } else {
            return res.send(err);
        }
    });
};

exports.createImage = function(req, res) {
    var Image = mongoose.model('Image');
    console.log(req);

    var orgName = req.files.file.originalFilename;
    var path = req.files.file.path;
    var length = req.files.file.size;
    var type = 'image/jpeg';
    var lgtmFileName = "/tmp/lgtm_" + orgName;

    async.series([

        function(callback) {
            var dimensions = imageSize(req.files.file.path);
            console.log(dimensions.width, dimensions.height);
            console.log('1');
            var x = dimensions.width - 200;
            var y = dimensions.height - 10;

            gm(req.files.file.path)
                .fontSize(68)
                .stroke("#efe", 1)
                .fill("#555")
                .drawText(x, y, "LGTM")
                .write(lgtmFileName, function(err) {
                    if (err)
                        return console.log(arguments);
                    console.log(this.outname + ' created  :: ' + arguments[3]);
                    callback(null, 1);
                });
        },
        function(callback) {
            console.log('2');
            var client = s3client.createClient({
                key: process.env.AWS_ACCESS_KEY_ID,
                secret: process.env.AWS_SECRET_ACCESS_KEY,
                bucket: 'lgtmtest',
                region: 'us-west-2'
            });
            console.log(lgtmFileName);
            console.log(orgName);
            console.log(length);
            console.log(type);

            var stat = fs.statSync(lgtmFileName);
            client.putFile(lgtmFileName, "/lgtm_" + orgName, {
                'Content-Length': stat.size,
                'Content-Type': type,
                'x-amz-acl': 'public-read'
            }, function(err, s3res) {
                console.log('2 done');
                callback(null, 2);
            });
        },
        function(callback) {
            console.log('3');
            new Image({
                name: orgName,
                url: orgName
            }).save(function() {
                console.log('3 done');
                callback(null, 3);
            });
        }
    ], function(err, results) {
        if (err) {
            throw err;
        }
        console.log('all done');
        console.log(results);

    });
    res.end();
};
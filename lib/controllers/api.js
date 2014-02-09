'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');

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
'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

var mongoose = require('mongoose');
var async = require('async');
var config = require('config/config');
var util = require('util');
var socketIo = null;

exports.setSocketIo = function(io) {
    console.log("setSocketIo");
    socketIo = io;

    socketIo.sockets.on('connection', function(socket) {
        console.log("websocket conneted");
        socket.emit('update', null);
        socket.on('disconnect', function() {
            console.log("websocket conneted");
        });

    });
};

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
    return mongoose.model('Thing').find(function(err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

var getImageSavePath = function(targetDir, name) {
    var path = require('path');
    var targetPath = path.join(config.app_root, config.upload_dir);
    return util.format('%s/%s/%s', targetPath, targetDir, name);
};

var getImageLoadPath = function(targetDir, name) {
    return util.format('%s/%s/%s/%s', config.app_host, config.upload_dir, targetDir, name);
};

exports.getImageSavePath = function(targetDir, name) {
    return getImageSavePath(targetDir, name);
};

exports.getImageLoadPath = function(targetDir, name) {
    return getImageLoadPath(targetDir, name);
};

var getImage = function(req, res) {
    var id = req.route.params.id;

    return mongoose.model('Image').find({
            _id: id
        },
        function(err, images) {
            if (err) {
                console.log(err);
                return res.send('image not found', 404);
            }

            var image = images[0];
            return res.json({
                'id': image._id,
                'name': image.name,
                'src': getImageLoadPath('lgtm', image.name)
            });
        });
};

var getImages = function(req, res) {
    return mongoose.model('Image').find({}).sort({
        updated_at: 'desc'
    }).exec(function(err, images) {
        if (err) {
            console.log(err);
            return res.send('images not found', 404);
        }
        return res.json(require('lodash').map(images, function(image) {
            return {
                'id': image._id,
                'src': getImageLoadPath('lgtm', image.name),
                'name': image.name
            };
        }));
    });

};

exports.image = function(req, res) {
    return getImage(req, res);
};

exports.images = function(req, res) {
    return getImages(req, res);
};

var resizeImage = function(req, res, callback) {
    var gm = require('gm');

    var orgName = req.files.file.originalFilename;
    var tmpPath = req.files.file.path;
    var resizeFileName = getImageSavePath('resize', orgName);
    var width = config.image_width;

    console.log('image resize start path' + tmpPath + ' -> ' + resizeFileName);

    gm(tmpPath)
        .resize(width)
        .write(resizeFileName, function(err) {
            if (err) {
                console.log(err);
                throw err;
            }

            console.log(this.outname + ' created  :: ' + arguments[3]);
            console.log('image resize end');
            callback(null, resizeFileName);
        });
};

var addLGTMImage = function(req, res, resizeFileName, callback) {
    var gm = require('gm');
    var imageSize = require('image-size');

    var orgName = req.files.file.originalFilename;
    var path = req.files.file.path;

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
            if (err) {
                console.log(err);
                throw err;
            }

            console.log(this.outname + ' created  :: ' + arguments[3]);
            console.log('image lgtm end');
            callback(null, lgtmFileName);
        });
};

var saveImage = function(req, res, callback) {
    var orgName = req.files.file.originalFilename;
    var Image = mongoose.model('Image');
    console.log('image create record start');
    new Image({
        name: orgName,
        url: orgName
    }).save(function(err, image) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log('image create record end');
        callback(null, image);
    });
};

exports.createImage = function(req, res) {
    async.waterfall([

            function(callback) {
                resizeImage(req, res, callback);
            },
            function(resizeFileName, callback) {
                addLGTMImage(req, res, resizeFileName, callback);
            },
            function(arg, callback) {
                saveImage(req, res, callback);
            },
            function(image, callback) {
                socketIo.sockets.emit('add', {
                    'id': image._id,
                    'src': getImageLoadPath('lgtm', image.name),
                    'name': image.name
                });
                callback(null, image);
            }
        ],
        function(err, image) {
            if (err) {
                console.log(err);
                throw err;
            }

            res.json({
                'id': image._id,
                'name': image.name,
                'src': getImageLoadPath('lgtm', image.name)
            });
        });
};

var findImage = function(req, res, callback) {
    var id = req.route.params.id;
    mongoose.model('Image').find({
            _id: id
        },
        function(err, images) {
            if (err) {
                console.log(err);
                throw err;
            }

            callback(null, images[0]);
        }
    );
};

var removeImage = function(req, res, image, callback) {
    mongoose.model('Image').remove({
            _id: image._id
        },
        function(err) {
            if (err) {
                throw err;
            }
            console.log('delete success');
            callback(null, null);
        }
    );

};

exports.deleteImage = function(req, res) {
    console.log('delete image start id:' + req.route.params.id);
    async.waterfall([

            function(callback) {
                findImage(req, res, callback);
            },
            function(image, callback) {
                removeImage(req, res, image, callback);
            },
        ],
        function(err, results) {
            if (err) {
                throw err;
            }
            console.log('delete image end');
            socketIo.sockets.emit('update', null);
        });
    res.end();
};
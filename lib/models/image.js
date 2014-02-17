'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema
var ImageSchema = new Schema({
    name: String,
    tags: Array,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Image', ImageSchema);
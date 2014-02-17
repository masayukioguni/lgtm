'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Thing = mongoose.model('Thing'),
    Image = mongoose.model('Image');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Thing.find({}).remove(function() {
    Thing.create({
        name: 'HTML5 Boilerplate',
        info: 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
        awesomeness: 10
    }, {
        name: 'AngularJS',
        info: 'AngularJS is a toolset for building the framework most suited to your application development.',
        awesomeness: 10
    }, {
        name: 'Karma',
        info: 'Spectacular Test Runner for JavaScript.',
        awesomeness: 10
    }, {
        name: 'Express',
        info: 'Flexible and minimalist web application framework for node.js.',
        awesomeness: 10
    }, {
        name: 'MongoDB + Mongoose',
        info: 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
        awesomeness: 10
    }, function() {
        console.log('finished populating things');
    });
});

// Clear old users, then add a default user
User.find({}).remove(function() {
    User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
    }, function() {
        console.log('finished populating users');
    });
});


Image.find({}).remove(function() {
    Image.create({
        name: 'test1_name',
        tags: ['1a', '1b', '1c']
    }, {
        name: 'test2_name',
        tags: ['2a', '2b', '2c']
    }, function(err) {
        console.log('finished populating Images');
    });
});
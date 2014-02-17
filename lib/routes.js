'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

var api = require('./controllers/api');
var index = require('./controllers/index');
var users = require('./controllers/users');
var session = require('./controllers/session');
var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

    // Server API Routes
    app.get('/api/awesomeThings', api.awesomeThings);
    app.get('/api/images', api.images);
    app.get('/api/image/:id', api.image);
    app.del('/api/image/:id', api.deleteImage);

    app.post('/api/images', api.createImage);

    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);

    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};
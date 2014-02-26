'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    http = require('http'),
    socketio = require('socket.io');

/**
 * Main application file
 */

// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + '/' + file);
});

// Populate empty DB with sample data
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log('**** load dummy data ****')
    require('./lib/config/dummydata');
}
// Passport Configuration
require('./lib/config/passport')();

var app = express();
var server = http.createServer(app);

// Init Socket.io server
var socketIo = socketio.listen(server);
app.set('socket.io.log.level', process.env.SOCKET_IO_LOG_LEVEL || 1);

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app, socketIo);

// Start server
server.listen(config.port, function() {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
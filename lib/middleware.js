'use strict';
var path = require('path');
module.paths.push(path.resolve(path.join('lib')));

/**
 * Custom middleware used by the application
 */
module.exports = {

    /**
     *  Protect routes on your api from unauthenticated access
     */
    auth: function auth(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.send(401);
    },

    /**
     * Set a cookie for angular so it knows we have an http session
     */
    setUserCookie: function(req, res, next) {
        if (req.user) {
            res.cookie('user', JSON.stringify(req.user.userInfo));
        }
        next();
    }
};
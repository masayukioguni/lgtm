'use strict';

angular.module('lgtmApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });

'use strict';

angular.module('lgtmApp')
    .controller('ShowCtrl', function($scope, $http, $routeParams) {
        var id = $routeParams.id;
        $http.get('/api/image/' + id).success(function(image) {
            $scope.image = image;
        });
    });
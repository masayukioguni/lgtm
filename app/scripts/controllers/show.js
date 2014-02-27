'use strict';

angular.module('lgtmApp')
    .controller('ShowCtrl', function($scope, $http, $routeParams, $location) {
        var id = $routeParams.id;
        $http({
            method: 'GET',
            url: '/api/image/' + id
        }).
        success(function(data, status, headers, config) {
            $scope.image = data;
            $scope.content = '![LGTM](' + data.src + ')';

        }).
        error(function(data, status, headers, config) {
            $location.path('/');
        });
        $scope.onDelete = function() {
            if (confirm("消すよ?")) {
                $http({
                    method: 'DELETE',
                    url: '/api/image/' + id
                }).
                success(function(data, status, headers, config) {
                    console.log('delete' + 'id:' + id + 'success');
                    $location.path('/');
                }).
                error(function(data, status, headers, config) {
                    console.log('delete' + 'id:' + id + 'failed');
                });
            }
        };
    });
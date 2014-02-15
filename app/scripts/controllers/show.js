'use strict';

angular.module('lgtmApp')
    .controller('ShowCtrl', function($scope, $http, $routeParams, $location) {
        var id = $routeParams.id;
        $http({
            method: 'GET',
            url: '/api/image/' + id
        }).
        success(function(data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            $scope.image = data;
            $scope.content = '![LGTM](' + data.src + ')';

            // this callback will be called asynchronously
            // when the response is available
        }).
        error(function(data, status, headers, config) {
            console.log("sssss");
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            $location.path('/');

            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        /*
        $http.get('/api/image/' + id).success(function(image) {
            $scope.image = image;
            $scope.content = '![LGTM](' + image.src + ')';
        });
*/
        $scope.onDelete = function() {
            console.log(id);
            $http.delete('/api/image/' + id).success(function(image) {
                console.log('success');

            });


        };
    });
'use strict';

angular.module('lgtmApp')
    .controller('ShowCtrl', function($scope, $http, $routeParams) {
        var id = $routeParams.id;
        $http.get('/api/image/' + id).success(function(image) {
            $scope.image = image;
            $scope.content = '![LGTM](' + image.src + ')';
        });

        $scope.onDelete = function() {
            console.log(id);
            $http.delete('/api/image/' + id).success(function(image) {
                console.log('success');

            });


        };
    });
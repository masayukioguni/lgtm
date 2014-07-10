'use strict';

angular.module('lgtmApp')
    .controller('ImageCtrl', function($scope, $http, $upload, $location, $route) {
        var socket = io.connect($location.absUrl());
        var main_images = null;
        $scope.message = 'ここにファイルをドロップしてね！！';


        $http.get('/api/images').success(function(images) {
            main_images = images
            $scope.images = main_images;
        });

        socket.on('add', function(image) {
            main_images.unshift(image);
            $scope.$apply(function() {
                $scope.images = main_images;
            });
        });

        socket.on('update', function(image) {
            console.log("websocket update");
            $http.get('/api/images').success(function(images) {
                main_images = images;
                $scope.images = main_images;
            });
        });

        var validation = function(files) {
            var length = files.length;
            for (var i = 0; i < length; i++) {
                var file = files[i];

                if (file.type !== 'image/jpeg') {
                    return true;
                }

                if (file.size > 3 * 1024 * 1024) {
                    return true;
                }
            }
            return false;
        }

        $scope.onFileSelect = function($files) {

            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];

                $scope.upload = $upload.upload({
                    url: '/api/images',
                    method: 'POST',
                    headers: {
                        'headerKey': 'headerValue'
                    },
                    withCredential: true,
                    file: file,
                }).progress(function(evt) {
                    var percent = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {});
            }
        };
    });
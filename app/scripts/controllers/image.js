'use strict';

angular.module('lgtmApp')
    .controller('ImageCtrl', function($scope, $http, $upload, $location) {
        $http.get('/api/images').success(function(images) {
            $scope.images = images;
            $scope.message = 'ここにファイルをドロップしてね！！';
        });

        $scope.onFileSelect = function($files) {
            console.log($files);
            //$files: an array of files selected, each file has name, size, and type.
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
                    $scope.message = 'いまアップロード中 ' + percent + '%終了';

                    if (percent === 100) {
                        $scope.message = 'ここにファイルをドロップしてね！！';
                    }
                }).success(function(data, status, headers, config) {
                    $location.path('/');
                });
            }
        };
    });
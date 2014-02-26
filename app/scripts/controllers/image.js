'use strict';

angular.module('lgtmApp')
    .controller('ImageCtrl', function($scope, $http, $upload, $location, $route) {
        var socket = io.connect('http://localhost');
        socket.on('update', function(images) {
            $route.reload();
        });

        $http.get('/api/images').success(function(images) {
            $scope.images = images;
            $scope.message = 'ここにファイルをドロップしてね！！';
            $scope.infomation = '';
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
            if (validation($files) === true) {
                $scope.infomation = '画像フォーマットが違う、またはサイズが3M以上なのでアップロードできない';
                return;
            }

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
                    $scope.infomation = 'いまアップロード中 ' + percent + '%終了';

                    if (percent === 100) {
                        $scope.message = 'ここにファイルをドロップしてね！！';
                        $scope.infomation = '完了';
                    }
                }).success(function(data, status, headers, config) {});
            }
        };
    });
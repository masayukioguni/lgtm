'use strict';

angular.module('lgtmApp')
    .controller('ImageCtrl', function($scope, $http, $upload) {
        $http.get('/api/images').success(function(images) {
            $scope.images = images;
        });

        $scope.onFileSelect = function($files) {
            console.log($files);
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/images', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    headers: {
                        'headerKey': 'headerValue'
                    },
                    withCredential: true,
                    /*
                    data: {
                        myObj: $scope.myModelObj
                    },
                    */
                    file: file,
                    // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} 
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });
            }
        };
    });
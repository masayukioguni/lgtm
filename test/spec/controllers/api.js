'use strict';

describe('API', function() {

    // load the controller's module
    beforeEach(module('lgtmApp'));

    var MainCtrl,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($http, $controller, $rootScope) {
        $httpBackend = $http;
    }));

    it('should attach a list of s to the scope', function() {

        $httpBackend({
            method: 'GET',
            url: '/api/images'
        }).
        success(function(data, status, headers, config) {
            expect(scope.awesomeThings).toBeUndefined();
            expect(scope.awesomeThings.length).toBe(4);

            /*$scope.images = images;
            $scope.message = "ここにファイルをドロップしてね！！"*/
        }).error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        console.log("saa");


        /*
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
  */
    });
});
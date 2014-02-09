'use strict';

describe('Controller: ImageCtrl', function() {

    // load the controller's module
    beforeEach(module('lgtmApp'));

    var ImageCtrl,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/images')
            .respond([{'name':'test1'},{'name':'test2'}]);
        scope = $rootScope.$new();
        ImageCtrl = $controller('ImageCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of Images to the scope', function() {
        expect(scope.images).toBeUndefined();
        $httpBackend.flush();
        expect(scope.images.length).toBe(2);
        expect(scope.images[0].name).toBe('test1');
         
    });
});
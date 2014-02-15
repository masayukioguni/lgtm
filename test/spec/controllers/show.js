'use strict';

describe('Controller: ShowCtrl', function() {

    // load the controller's module
    beforeEach(module('lgtmApp'));

    var ShowCtrl,
        scope, routeParams,
        $httpBackend, $controller, $rootScope, $routeParams, $location;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, _$controller_, _$rootScope_, _$routeParams_, _$location_) {
        $httpBackend = _$httpBackend_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $routeParams = _$routeParams_;
        $location = _$location_;
        scope = $rootScope.$new();
        routeParams = {
            id: 1
        };
        ShowCtrl = $controller('ShowCtrl', {
            $routeParams: routeParams,
            $scope: scope
        });
    }));

    afterEach(function() {

    });

    it('should be able to obtain the required parameters', function() {
        $httpBackend.expectGET('/api/image/1')
            .respond(200, {
                src: 'test'
            });
        expect(scope.image).toBeUndefined();
        expect(scope.content).toBeUndefined();
        $httpBackend.flush();
        expect(scope.image).toEqual({
            src: 'test'
        });
        expect(scope.content).toEqual('![LGTM](test)');

    });
    it('should be redirected to the top page have set the invalid id', function() {
        $httpBackend.expectGET('/api/image/1')
            .respond(400, null);
        $httpBackend.flush();
        expect($location.path()).toBe('/');
    });

    it('should have a post request, be redirected to the top page', function() {
        /* テストの仕方がよくわからん....
        $httpBackend.expectDELETE('/api/image/1')
            .respond(200);
        expect(scope.image).toBeUndefined();
        expect(scope.content).toBeUndefined();
        $httpBackend.flush();
        console.log(scope.onDelete());
        expect($location.path()).toBe('/');
        */
    });


});
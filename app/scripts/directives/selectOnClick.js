'use strict';
console.log("adkasmdklaskldalks");
angular.module('lgtmApp')
    .directive('selectOnClick', function() {
        console.log("adkasmdklaskldalks");
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('click', function() {

                    this.select();
                });
            }
        };
    });
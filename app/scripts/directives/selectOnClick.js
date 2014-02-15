'use strict';
console.log("adkasmdklaskldalks");
angular.module('lgtmApp')
    .directive('selectOnClick', function($timeout) {
        console.log("adkasmdklaskldalks");
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // dirty hack
                // document.readyで拾った場合,文字列が展開される前に呼ばれるため、
                // selectが無効になる
                var selectedText = function() {
                    $('#lgtm-url').select();
                }
                $timeout(selectedText, 500);
            }
        };
    });
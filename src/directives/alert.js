var TO = '';
var ELEMENTS = 'E';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.directive('alertMessage', [
    '$rootScope', '$parse',
    function($rootScope, $parse) {

        return {

            restrict: TO += ELEMENTS,

            link: function($scope, element, attributes) {

                $rootScope.$broadcast('alert', {

                    type: attributes.type,
                    message: element.html()
                });

                element.remove();
            }
        };
    }
]);


var TO = '';
var ELEMENTS = 'E';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

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


var TO = '';
var ATTRIBUTES = 'A';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var focusOff;

IntelligenceWebClient.directive('focusOn', [
    '$timeout',
    function($timeout) {

        var directive = {

            restrict: TO += ATTRIBUTES,
            scope: {
                focusOn: '='
            },
            link: link
        };

        function link($scope, element, attributes) {

            $scope.$watch('focusOn', function(focusOn) {

                if (focusOn) {

                    $timeout(function() {

                        element[0].focus();

                    }, 0);
                }
            });
        }

        return directive;
    }
]);


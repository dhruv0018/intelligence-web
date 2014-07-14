var TO = '';
var ATTRIBUTES = 'A';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

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

                var focusWhen = !!attributes.focusWhen;

                if (focusOn && focusWhen) {

                    $timeout(function() {

                        element[0].focus();

                    }, 0);
                }
            });
        }

        return directive;
    }
]);


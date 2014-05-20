var TO = '';
var ATTRIBUTES = 'A';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.directive('focusWhen', [
    '$timeout',
    function($timeout) {

        var directive = {

            restrict: TO += ATTRIBUTES,
            link: link
        };

        function link($scope, element, attributes) {

            attributes.$observe('focusWhen', function(focusWhen) {

                var focus = $scope.$eval(focusWhen);

                if (focus === true) {

                    $timeout(function() {

                        element[0].focus();

                    }, 0);
                }
            });

            element.bind('focus', function() {

                $scope.$apply(function() {

                    if (!$scope.focusWhen) {

                        $scope.focusWhen = true;
                    }
                });
            });

            element.bind('blur', function() {

                $scope.$apply(function() {

                    $scope.focusWhen = false;
                });
            });

            element.on('$destroy', function() {

                element.unbind('focus');
                element.unbind('blur');
            });
        }

        return directive;
    }
]);


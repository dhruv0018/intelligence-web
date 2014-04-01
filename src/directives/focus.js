var TO = '';
var ATTRIBUTES = 'A';

var IntelligenceWebClient = require('../app');

IntelligenceWebClient.directive('focusWhen', [
    function() {

        var directive = {

            restrict: TO += ATTRIBUTES,
            scope: {
                focusWhen: '@'
            },
            link: link
        };

        function link($scope, element, attributes) {

            $scope.$watch('focusWhen', function(focus) {

                if (focus === true) {

                    element[0].focus();
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
        }

        return directive;
    }
]);


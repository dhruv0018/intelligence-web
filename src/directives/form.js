var TO = '';
var ELEMENTS = 'E';

var IntelligenceWebClient = require('../app');

IntelligenceWebClient.directive('form', [
    function () {

        var directive = {

            restrict: TO += ELEMENTS,
            require: 'form',
            link: link
        };

        function link($scope, element, attributes, controller) {

            if (!controller) return;

            $scope.$watch(function() {

                return controller.$valid;

            }, function(valid) {

                $scope.$parent[controller.$name] = angular.copy(controller);
            });

        }

        return directive;
    }
]);


var TO = '';
var ELEMENTS = 'E';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.directive('button', [
    function() {

        var directive = {

            restrict: TO += ELEMENTS,
            require: '?^form',
            link: link
        };

        function link($scope, element, attributes, controller) {

            if (!controller || !attributes) return;

            if (attributes.type === 'submit') {

                $scope.$watch(function() {

                    return controller.$valid;

                }, function(valid) {

                    attributes.$set('disabled', !valid);
                });
            }
        }

        return directive;
    }
]);


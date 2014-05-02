var TO = '';
var ATTRIBUTES = 'A';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.directive('autofocusWhen', [
    function() {

        var directive = {

            restrict: TO += ATTRIBUTES,
            link: link
        };

        function link($scope, element, attributes) {

            $scope.$watch(attributes.autofocusWhen, function(autofocus) {

                if (autofocus) element.attr('autofocus','true');
                else element.removeAttr('autofocus');
            });
        }

        return directive;
    }
]);


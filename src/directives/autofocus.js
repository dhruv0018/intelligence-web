var TO = '';
var ATTRIBUTES = 'A';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.directive('autofocusWhen', [
    function() {

        var directive = {

            restrict: TO += ATTRIBUTES,
            link: link
        };

        function link($scope, element, attributes) {

            attributes.$observe('autofocusWhen', function(autofocusWhen) {

                var autofocus = $scope.$eval(autofocusWhen);

                if (autofocus) element.attr('autofocus','true');
                else element.removeAttr('autofocus');
            });
        }

        return directive;
    }
]);


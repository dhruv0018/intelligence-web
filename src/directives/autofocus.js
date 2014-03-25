var TO = '';
var ATTRIBUTES = 'A';

var IntelligenceWebClient = require('../app');

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


var TO = '';
var ATTRIBUTES = 'A';

var IntelligenceWebClient = require('../app');

var directiveName = 'match';

IntelligenceWebClient.directive(directiveName, [
    '$parse',
    function($parse) {

        var directive = {

            restrict: TO += ATTRIBUTES,
            require: 'ngModel',
            link: link
        };

        function link($scope, element, attributes, controller) {

            if (!controller) return;
            if (!attributes[directiveName]) return;

            var formController = element.inheritedData('$formController');
            var matchController = formController[attributes[directiveName]];

            if (!matchController) return;

            controller.$parsers.push(function(value) {

                var valid = matchController.$viewValue === value;

                controller.$setValidity(directiveName, valid);
                matchController.$setValidity(directiveName, valid);

                return value;
            });

            matchController.$parsers.push(function(value) {

                var valid = controller.$viewValue === value;

                controller.$setValidity(directiveName, valid);
                matchController.$setValidity(directiveName, valid);

                return value;
            });
        }

        return directive;
    }
]);

var TO = '';
var ELEMENTS = 'E';

var IntelligenceWebClient = require('../app');

IntelligenceWebClient.directive('alertMessage', [
    '$rootScope', '$parse',
    function($rootScope, $parse) {

        return {

            restrict: TO += ELEMENTS,

            link: function($scope, element, attributes) {

                $rootScope.$broadcast('alert', {

                    type: attributes.type,
                    message: element.html()
                });

                element.remove();
            }
        };
    }
]);


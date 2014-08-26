var TO = '';
var ELEMENTS = 'E';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.directive('a', [
    '$rootScope',
    function($rootScope) {

        var directive = {

            restrict: TO += ELEMENTS,
            link: link
        };

        function link($scope, element, attributes, controller) {

            var disabled = element.hasClass('disabled');
            var pointerEvents = element.css('pointer-events');

            /* Disable buttons on start of state change */
            $rootScope.$on('$stateChangeStart', function() {

                element.addClass('disabled');
                element.css('pointer-events', 'none');
            });

            /* Reset disabled button state on state change success */
            $rootScope.$on('$stateChangeSuccess', function() {

                element.toggleClass('disabled', disabled);
                element.css('pointer-events', pointerEvents);
            });

            /* Reset disabled button state on state change error */
            $rootScope.$on('$stateChangeError', function() {

                element.toggleClass('disabled', disabled);
                element.css('pointer-events', pointerEvents);
            });
        }

        return directive;
    }
]);


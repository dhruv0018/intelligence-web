var TO = '';
var ELEMENTS = 'E';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.directive('a', [
    '$rootScope',
    function($rootScope) {

        var directive = {

            restrict: TO += ELEMENTS,
            link: link
        };

        function link($scope, element, attributes, controller) {

            var disabled = element.hasClass('disabled');

            /* Disable buttons on HTTP requests */
            $rootScope.$on('httpRequest', function() {

                /* Prevent clicks. */
                element.on('click', function(event) {

                    event.preventDefault();
                });

                element.addClass('disabled');
            });

            /* Reset disabled button state on HTTP request error */
            $rootScope.$on('httpRequestError', function() {

                element.off('click');
                element.toggleClass('disabled', disabled);
            });

            /* Reset disabled button state on HTTP response */
            $rootScope.$on('httpResponse', function() {

                element.off('click');
                element.toggleClass('disabled', disabled);
            });

            /* Reset disabled button state on HTTP response error */
            $rootScope.$on('httpResponseError', function() {

                element.off('click');
                element.toggleClass('disabled', disabled);
            });

            /* Disable buttons on start of state change */
            $rootScope.$on('$stateChangeStart', function() {

                /* Prevent clicks. */
                element.on('click', function(event) {

                    event.preventDefault();
                });

                element.addClass('disabled');
            });

            /* Reset disabled button state on state change success */
            $rootScope.$on('$stateChangeSuccess', function() {

                element.off('click');
                element.toggleClass('disabled', disabled);
            });

            /* Reset disabled button state on state change error */
            $rootScope.$on('$stateChangeError', function() {

                element.off('click');
                element.toggleClass('disabled', disabled);
            });
        }

        return directive;
    }
]);


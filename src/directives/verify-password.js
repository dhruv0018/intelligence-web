var TO = '';
var ATTRIBUTES = 'A';

var IntelligenceWebClient = require('../app');

IntelligenceWebClient.directive('krossoverVerifyPassword', [
    '$rootScope', '$injector', 'config', 'SessionService', 'AuthenticationService',
    function ($rootScope, $injector, config, session, auth) {

        var directive = {

            restrict: TO += ATTRIBUTES,
            require: 'ngModel',
            link: link
        };

        function link($scope, element, attributes, controller) {

            /* TODO: Debounce model changes to rate limit this.
             *       This is coming soon in core Angular. */
            $scope.$watch(attributes.ngModel, function() {

                var password = $scope.$eval(attributes.ngModel);

                if (password && password.length >= 4) {

                    /* Request authentication from the server. */
                    auth.validatePassword(null, password, function (error) {

                        controller.$setValidity('password', !error);
                    });
                }
            });
        }

        return directive;
    }
]);


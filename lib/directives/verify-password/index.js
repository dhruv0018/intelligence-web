/* Constants */
let TO = '';
const ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * VerifyPassword
 * @module VerifyPassword
 */
const VerifyPassword = angular.module('VerifyPassword', []);

/**
 * Verify password directive.
 * Verifies a users password.
 * @module VerifyPassword
 * @name VerifyPassword
 * @type {directive}
 */
VerifyPassword.directive('krossoverVerifyPassword', [
    'SessionService', 'AuthenticationService',
    function(session, auth) {

        const directive = {

            restrict: TO += ATTRIBUTES,
            require: 'ngModel',
            link: link
        };

        function link($scope, element, attributes, controller) {

            var validPassword;

            controller.$setValidity('password', false);

            /* TODO: Debounce model changes to rate limit this.
             *       This is coming soon in core Angular. */
            $scope.$watch(attributes.ngModel, function() {

                var password = $scope.$eval(attributes.ngModel);

                if (validPassword) {

                    if (password === validPassword) {

                        controller.$setValidity('password', true);
                    }

                    else {

                        controller.$setValidity('password', false);
                    }
                }

                else if (password && password.length >= 4) {

                    /* Request authentication from the server. */
                    auth.validatePassword(null, password)

                    .then(function() {

                        /* Record valid password. */
                        validPassword = password;

                        controller.$setValidity('password', true);
                    })

                    .catch(function() {

                        controller.$setValidity('password', false);
                    });
                }
            });
        }

        return directive;
    }
]);

export default VerifyPassword;

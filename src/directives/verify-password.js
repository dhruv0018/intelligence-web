var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var component = require('../../build/build.js');

var OAuth = component('oauth');

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

            $scope.$watch(attributes.ngModel, function() {

                var email = session.currentUser.email;
                var password = $scope.$eval(attributes.ngModel);

                var oauth = $injector.instantiate(['config', OAuth]);

                if (password && password.length >= 4) {

                    /* Request authentication from the server. */
                    oauth.requestAuthCode(email, password, function(error) {

                        $rootScope.$apply(function() {

                            if (error) controller.$setValidity('password', false);

                            else controller.$setValidity('password', true);
                        });
                    });
                }
            });
        }

        return directive;
    }
]);


/* Constants */
var TO = '';
var ELEMENTS = 'E';


/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * NoProfileReels
 * @module NoProfileReels
 */
var NoProfileReels = angular.module('NoProfileReels', []);

/**
 * NoProfileReels Directive
 * @module NoProfileReels
 * @name NoProfileReelsDirective
 * @type {directive}
 */
NoProfileReels.directive('noProfileReels', [
    function directive() {

        var noProfileReels = {

            restrict: TO += ELEMENTS,

            templateUrl: 'lib/directives/no-profile-reels/template.html',

            controller: 'NoProfileReels.Controller'
        };

        return noProfileReels;
    }
]);

/**
 * NoProfileReels Controller
 * @module NoProfileReels
 * @name NoProfileReelsController
 * @type {controller}
 */
NoProfileReels.controller('NoProfileReels.Controller', [
    '$scope', 'AuthenticationService',
    function controller($scope, auth) {

        $scope.userIsLoggedIn = auth.isLoggedIn;
    }
]);

export default NoProfileReels;

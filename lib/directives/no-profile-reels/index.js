/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * NoProfileReels
 * @module NoProfileReels
 */
var NoProfileReels = angular.module('NoProfileReels', []);

/* Cache the template file */
NoProfileReels.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('no-profile-reels.html', template);
    }
]);

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

            templateUrl: 'no-profile-reels.html',

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

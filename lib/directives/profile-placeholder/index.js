/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile Placeholder
 * @module Profile Placeholder
 */
var profilePlaceholder = angular.module('profile-placeholder', []);

/* Cache the template file */
profilePlaceholder.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('profile-placeholder.html', template);
    }
]);

/**
 * Profile Placeholder directive.
 * @module Profile Placeholder
 * @name Profile Placeholder
 * @type {Directive}
 */
profilePlaceholder.directive('profilePlaceholder', [
    function directive() {

        var profileplaceholder = {

            restrict: TO += ELEMENTS,

            scope: {
                role: '='
            },

            controller: 'profilePlaceholder.controller',

            templateUrl: 'profile-placeholder.html',

            link: function(scope, element, attrs) {
                attrs.$observe('size', function(size) {
                    scope.size = size;
                });
            }
        };

        return profileplaceholder;
    }
]);

profilePlaceholder.controller('profilePlaceholder.controller', [
    '$scope', 'ROLES', 'UsersFactory',
    function controller($scope, ROLES, users) {

        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;
        $scope.INDEXER = ROLES.INDEXER;
        $scope.COACH = ROLES.COACH;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.FILM_EXCHANGE_ADMIN = ROLES.FILM_EXCHANGE_ADMIN;

        $scope.users = users;

    }
]);

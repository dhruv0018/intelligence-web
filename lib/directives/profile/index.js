/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile
 * @module roster-manager
 */
var Profile = angular.module('Profile', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Profile.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('profile.html', require('./template.html'));
    }
]);

/**
 * Profile directive.
 * @module Profile
 * @name Profile
 * @type {Directive}
 */
Profile.directive('profile', [
    'UsersFactory',
    function directive(users) {

        var profile = {

            restrict: TO += ELEMENTS,
            templateUrl: 'profile.html',
            scope: {
                role: '=?',
                roster: '=?',
                rosterId: '=?',
                positions: '=?'
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.keys = window.Object.keys;
                scope.users = users.getCollection();
                scope.usersFactory = users;
                scope.options = {
                    scope: scope
                };
            }
        };

        return profile;
    }
]);

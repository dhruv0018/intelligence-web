/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * UserTypeahead
 * @module UserTypeahead
 */
var UserTypeahead = angular.module('user-typeahead', ['ui.bootstrap']);

/* Cache the template file */
UserTypeahead.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('user-typeahead.html', require('./template.html'));
    }
]);

/**
 * UserTypeahead directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
UserTypeahead.directive('userTypeahead', [
    '$filter', '$state', 'UsersFactory',
    function directive($filter, $state, users) {

        var userTypeahead = {

            restrict: TO += ELEMENTS,
            templateUrl: 'user-typeahead.html',
            scope: {
                user: '='
            },
            replace: true,
            link: function(scope, element, attrs) {

                scope.findUsers = function() {
                    return users.query({lastName: scope.user, count: 10}).then(function(users) {
                        return $filter('orderBy')(users, 'name');
                    });
                };
            }
        };

        return userTypeahead;
    }
]);

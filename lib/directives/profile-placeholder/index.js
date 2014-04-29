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


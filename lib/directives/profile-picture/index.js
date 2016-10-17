/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ProfilePicture
 * @module ProfilePicture
 */
var ProfilePicture = angular.module('ProfilePicture', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * ProfilePicture directive.
 * @module ProfilePicture
 * @name ProfilePicture
 * @type {Directive}
 */
ProfilePicture.directive('profilePicture', [
    function directive() {

        var profilePicture = {

            restrict: TO += ELEMENTS,

            scope: {
                user: '='
            },

            templateUrl: 'lib/directives/profile-picture/template.html',
        };

        return profilePicture;
    }
]);

export default ProfilePicture;

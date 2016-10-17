import ClipsNavigationController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';
const templateUrl = 'lib/directives/clips-navigation/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ClipsNavigation
 * @module ClipsNavigation
 */
const ClipsNavigation = angular.module('ClipsNavigation', []);

/**
 * ClipsNavigation directive.
 * @module ClipsNavigation
 * @name ClipsNavigation
 * @type {directive}
 */
ClipsNavigation.directive('clipsNavigation', [
    function directive() {

        const ClipsNavigation = {

            restrict: TO += ELEMENTS,

            scope: {
                video: '=',
                plays: '='
            },

            controller: ClipsNavigationController,

            templateUrl: templateUrl
        };

        return ClipsNavigation;
    }
]);

export default ClipsNavigation;

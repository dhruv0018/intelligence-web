import ClipsNavigationController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'clips-navigation.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ClipsNavigation
 * @module ClipsNavigation
 */
const ClipsNavigation = angular.module('ClipsNavigation', []);

/* Cache the template file */
ClipsNavigation.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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

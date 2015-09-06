import PlayHeaderController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'play-header.html';

/* Component resources */
import template from './template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * PlayHeader
 * @module PlayHeader
 */
const PlayHeader = angular.module('PlayHeader', [
    'ui.bootstrap'
]);

/* Cache the template file */
PlayHeader.run([
    '$templateCache',
    function run ($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PlayHeader directive.
 * @module PlayHeader
 * @name PlayHeader
 * @type {directive}
 */
PlayHeader.directive('playHeader', playHeader);

playHeader.$inject = [];

function playHeader () {

    let directive = {

        restrict: TO += ELEMENTS,
        controller: PlayHeaderController,
        templateUrl
    };

    return directive;
}

export default PlayHeader;

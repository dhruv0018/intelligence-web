import PlayFooterController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'play-footer.html';

/* Component resources */
import template from './template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * PlayFooter
 * @module PlayFooter
 */
const PlayFooter = angular.module('PlayFooter', [
    'ui.bootstrap'
]);

/* Cache the template file */
PlayFooter.run([
    '$templateCache',
    function run ($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PlayFooter directive.
 * @module PlayFooter
 * @name PlayFooter
 * @type {directive}
 */
PlayFooter.directive('playFooter', playFooter);

playFooter.$inject = [];

function playFooter () {

    let directive = {

        restrict: TO += ELEMENTS,
        controller: PlayFooterController,
        templateUrl
    };

    return directive;
}

export default PlayFooter;

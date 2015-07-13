import PillsController from './controller.js';

require('pill');

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'pills.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Pills
 * @module Pills
 */
const Pills = angular.module('Pills', ['Pill']);

/* Cache the template file */
Pills.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Pills directive.
 * @module Pills
 * @name Pills
 * @type {directive}
 */
Pills.directive('pills', [
    function directive() {

        const Pills = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            bindToController: true,

            controllerAs: 'pills',

            controller: PillsController,

            scope: {
                items: '=',
                removedItem: '=?'
            }
        };

        return Pills;
    }
]);

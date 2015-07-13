/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'pill.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Pill
 * @module Pill
 */
const Pill = angular.module('Pill', []);

/* Cache the template file */
Pill.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Pill directive.
 * @module Pill
 * @name Pill
 * @type {directive}
 */
Pill.directive('pill', [
    function directive() {

        const Pill = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            scope: {
                item: '='
            },

            require: '?^pills',

            link: PillLink
        };

        function PillLink(scope, element, attributes, controller) {

            controller.remove = controller.remove || angular.noop;

            scope.pills = controller;
        }

        return Pill;
    }
]);

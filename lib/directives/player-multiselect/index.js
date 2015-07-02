/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'player-multiselect/template.html';
const multiselectTemplateUrl = 'player-multiselect/multiselect-template.html';

/* Component resources */
const template = require('./template.html');
const multiselectTemplate = require('./multiselect-template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Player Multiselect
 * @module Player Multiselect
 */
const PlayerMultiselect = angular.module('PlayerMultiselect', [
    'ui.router',
    'ui.bootstrap',
    'ui.multiselect'
]);

/* Cache the template file */
PlayerMultiselect.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put(multiselectTemplateUrl, multiselectTemplate);
    }
]);

/**
 * Player Multiselect directive.
 * @module Player Multiselect
 * @name Player Multiselect
 * @type {Directive}
 */
PlayerMultiselect.directive('playerMultiselect', [
    function directive() {

        const playerMultiselect = {

            restrict: TO += ELEMENTS,

            templateUrl,

            scope: {
                players: '=',
                selectedIds: '=ngModel'
            },

            link: link
        };

        function link(scope, element, attributes) {

        }

        return playerMultiselect;
    }
]);

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


/**
 * Player Multiselect
 * @name playerMultiselect
 *
 * @description
 * Multiselect w/ single-select by default. Default 'type' label is optional.
 *
 * @param {string=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} selectedIds The currently selected model ids.
 * @param {string=?} type The type of object in the model used to display a label on the select button.
 * @param {string@?} multiple Set to true to have multiple selections or false for single-select

 * @example

<player-multiselect ng-model="filterModel.teamPlayersIds" players="::teamPlayerList" type="Player" multiple="true"></player-multiselect>
 */
PlayerMultiselect.directive('playerMultiselect', [
    function directive() {

        const playerMultiselect = {

            restrict: TO += ELEMENTS,

            templateUrl,

            scope: {
                players: '=',
                selectedIds: '=ngModel',
                type: '@?',
                multiple: '@?multiple'
            },

            link: link
        };

        function link(scope, element, attributes) {

            scope.multiple = scope.multiple || false;
        }

        return playerMultiselect;
    }
]);

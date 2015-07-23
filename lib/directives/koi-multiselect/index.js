/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'koi-multiselect/template.html';
const multiselectTemplateUrl = 'koi-multiselect/koi-multiselect-template.html';

/* Component resources */
const template = require('./template.html');
const multiselectTemplate = require('./koi-multiselect-template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * KOIMultiselect
 * @module KOIMultiselect
 */
const KOIMultiselect = angular.module('KOIMultiselect', [
    'ui.router',
    'ui.bootstrap',
    'ui.multiselect'
]);

/* Cache the template file */
KOIMultiselect.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put(multiselectTemplateUrl, multiselectTemplate);
    }
]);

/**
 * KOIMultiselect directive.
 * @module KOIMultiselect
 * @name KOIMultiselect
 * @type {Directive}
 */


/**
 * KOI Multiselect
 * @name koiMultiselect
 *
 * @description
 * KOIMultiselect w/ single-select by default. Default 'type' label is optional.
 *
 * @param {string=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} selectedIds The currently selected model ids.
 * @param {string=?} type The type of object in the model used to display a label on the select button.
 * @param {string@?} multiple Set to true to have multiple selections or false for single-select

 * @example

<koi-multiselect ng-model="filterModel.teamPlayersIds" items="::teamPlayerList" type="Player" multiple="true"></koi-multiselect>
 */
KOIMultiselect.directive('koiMultiselect', [
    function directive() {

        const multiselect = {

            restrict: TO += ELEMENTS,

            templateUrl,

            scope: {
                items: '=',
                selectedIds: '=ngModel',
                type: '@?',
                multiple: '@?multiple',
                defaultLabel: '@?'
            },

            link: link
        };

        function link(scope, element, attributes) {

            scope.multiple = scope.multiple || false;
        }

        return multiselect;
    }
]);

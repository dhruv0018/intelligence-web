/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'lib/directives/krossover-multiselect/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * KrossoverMultiselect
 * @module KrossoverMultiselect
 */
const KrossoverMultiselect = angular.module('KrossoverMultiselect', [
    'ui.router',
    'ui.bootstrap',
    'am.multiselect'
]);

/**
 * Krossover Multiselect
 * @name krossoverMultiselect
 *
 * @description
 * KrossoverMultiselect w/ single-select by default. Default 'type' label is optional.
 *
 * @param {string=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} selectedIds The currently selected model ids.
 * @param {string=?} type The type of object in the model used to display a label on the select button.
 * @param {string@?} multiple Set to true to have multiple selections or false for single-select

 * @example

<krossover-multiselect ng-model="filterModel.teamPlayersIds" items="::teamPlayerList" type="Player" multiple="true"></krossover-multiselect>
 */
KrossoverMultiselect.directive('krossoverMultiselect', [
    function directive() {

        const Multiselect = {

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

        return Multiselect;
    }
]);

export default KrossoverMultiselect;

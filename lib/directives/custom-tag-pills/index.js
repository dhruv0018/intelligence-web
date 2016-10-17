import CustomTagPillsController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';
const templateUrl = 'lib/directives/custom-tag-pills/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CustomTagPills
 * @module CustomTagPills
 */
const CustomTagPills = angular.module('CustomTagPills', []);

/**
 * CustomTagPills directive.
 * @module CustomTagPills
 * @name CustomTagPills
 * @type {directive}
 */
CustomTagPills.directive('customTagPills', [
    function directive() {

        const CustomTagPills = {

            restrict: TO += ELEMENTS,

            templateUrl,

            controller: CustomTagPillsController,

            scope: {
                selectedTags: '=ngModel',
                play: '=?'
            }
        };

        return CustomTagPills;
    }
]);

export default CustomTagPills;

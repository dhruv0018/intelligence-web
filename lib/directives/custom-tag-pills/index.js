import CustomTagPillsController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'custom-tag-pills.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CustomTagPills
 * @module CustomTagPills
 */
const CustomTagPills = angular.module('CustomTagPills', []);

/* Cache the template file */
CustomTagPills.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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

            templateUrl: templateUrl,

            controller: CustomTagPillsController,

            scope: {
                selectedTags: '=ngModel'
            }
        };

        return CustomTagPills;
    }
]);

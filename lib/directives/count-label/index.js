/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
const template = require('./template.html');
const templateUrl = 'CountLabel.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* CountLabel
* @module CountLabel
*/
const CountLabel = angular.module('CountLabel', []);

/* Cache the template file */
CountLabel.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
* CountLabel directive.
* @module CountLabel
* @name CountLabel
* @type {Directive}
*/

countLabelDirective.$inject = [
];

function countLabelDirective(
) {

    let countLabel = {

        restrict: TO += ELEMENTS,

        templateUrl,

        scope: {
            allCount: '=?',
            currentCount: '=',
            label: '@'
        }
    };

    return countLabel;
}

CountLabel.directive('countLabel', countLabelDirective);

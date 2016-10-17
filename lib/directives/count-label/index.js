/* Constants */
let TO = '';
const ELEMENTS = 'E';
const templateUrl = 'lib/directives/count-label/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* CountLabel
* @module CountLabel
*/
const CountLabel = angular.module('CountLabel', []);

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

export default CountLabel;

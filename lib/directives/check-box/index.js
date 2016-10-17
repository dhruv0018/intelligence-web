/* Constants */
let TO = '';
const ELEMENTS = 'E';
const templateUrl = 'lib/directives/check-box/template.html';


/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CheckBox
 * @module CheckBox
 */
const CheckBox = angular.module('CheckBox', []);

/**
 * CheckBox directive.
 * @module CheckBox
 * @name CheckBox
 * @type {directive}
 */
CheckBox.directive('checkBox', [
    function directive() {

        const CheckBox = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            scope: {

                checked: '=',
                indeterminate: '=?'
            }
        };

        return CheckBox;
    }
]);

export default CheckBox;

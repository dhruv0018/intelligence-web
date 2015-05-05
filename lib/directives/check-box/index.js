/* Constants */
const TO = '';
const ELEMENTS = 'E';

const templateUrl = 'check-box.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CheckBox
 * @module CheckBox
 */
const CheckBox = angular.module('CheckBox', []);

/* Cache the template file */
CheckBox.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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
                checked: '='
            }
        };

        return CheckBox;
    }
]);

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'check-box.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * CheckBox
 * @module CheckBox
 */
var CheckBox = angular.module('CheckBox', []);

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

        var CheckBox = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            scope: {
                checked: '=',
                required: '=',
                form: '='
            }
        };

        return CheckBox;
    }
]);

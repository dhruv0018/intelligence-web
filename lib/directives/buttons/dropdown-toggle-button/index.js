/* Constants */
const TO = '';
const ELEMENTS = 'E';

const templateUrl = 'dropdownToggleButton.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * DropdownToggleButton
 * @module DropdownToggleButton
 */
const DropdownToggleButton = angular.module('DropdownToggleButton', [
    'ngMdIcons'
]);

/* Cache the template file */
DropdownToggleButton.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * DropdownToggleButton directive.
 * @module DropdownToggleButton
 * @name DropdownToggleButton
 * @type {directive}
 */
DropdownToggleButton.directive('dropdownToggleButton', [
    function directive() {

        const dropdownToggleButton = {

            restrict: TO += ELEMENTS,

            scope: {
                toggledElement: '=',
                text: '=?'
            },

            controller: 'DropdownToggleButton.Controller',

            templateUrl: templateUrl,
        };

        return dropdownToggleButton;
    }
]);

/* File dependencies */
require('./controller');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * DropdownToggleButton
 * @module DropdownToggleButton
 */
var DropdownToggleButton = angular.module('DropdownToggleButton', [
    'ngMdIcons'
]);

/* Cache the template file */
DropdownToggleButton.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('dropdownToggleButton.html', template);
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

        var dropdownToggleButton = {

            restrict: TO += ELEMENTS,

            scope: {
                toggledElement: '='
            },

            controller: 'DropdownToggleButton.Controller',

            templateUrl: 'dropdownToggleButton.html',
        };

        return dropdownToggleButton;
    }
]);

/* File dependencies */
require('./controller');

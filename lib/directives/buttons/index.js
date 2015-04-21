/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Buttons module.
 * @module Buttons
 */
var Buttons = angular.module('Buttons', [
    'DropdownToggleButton'
]);

require('dropdown-toggle-button');

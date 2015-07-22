/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Buttons module.
 * @module Buttons
 */
var Buttons = angular.module('Buttons', [
    'DropdownToggleButton',
    'SaveButton'
]);

require('dropdown-toggle-button');
require('save-button');

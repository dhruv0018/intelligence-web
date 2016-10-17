/* Fetch angular from the browser scope */
var angular = window.angular;

import DropdownToggleButton from './dropdown-toggle-button/index.js';
import SaveButton from './save-button/index.js';

/**
 * Buttons module.
 * @module Buttons
 */
var Buttons = angular.module('Buttons', [
    'DropdownToggleButton',
    'SaveButton'
]);

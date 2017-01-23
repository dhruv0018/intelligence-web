import StyleguideDropdownsState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Dropdowns
 * @module StyleguideDropdowns
 */
const StyleguideDropdowns = angular.module('Styleguide.Dropdowns', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideDropdowns.config(StyleguideDropdownsState);

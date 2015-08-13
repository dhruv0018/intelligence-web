import StyleguideFormsState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Forms
 * @module StyleguideForms
 */
const StyleguideForms = angular.module('Styleguide.Forms', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideForms.config(StyleguideFormsState);

import StyleguideButtonsState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Buttons
 * @module StyleguideButtons
 */
const StyleguideButtons = angular.module('Styleguide.Buttons', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideButtons.config(StyleguideButtonsState);

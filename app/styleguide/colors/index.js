import StyleguideColorsState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Colors
 * @module StyleguideColors
 */
const StyleguideColors = angular.module('Styleguide.Colors', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideColors.config(StyleguideColorsState);

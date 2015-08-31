import StyleguideCustomState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Custom
 * @module StyleguideCustom
 */
const StyleguideCustom = angular.module('Styleguide.Custom', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideCustom.config(StyleguideCustomState);

export default StyleguideCustom;

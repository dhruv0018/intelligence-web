import StyleguideTypographyState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Typography
 * @module StyleguideTypography
 */
const StyleguideTypography = angular.module('Styleguide.Typography', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideTypography.config(StyleguideTypographyState);

import StyleguideState from './state.js';
import StyleguideColors from './colors';
import StyleguideTypography from './typography';
import StyleguideButtons from './buttons';
import StyleguideForms from './forms';
import StyleguideCustom from './custom';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide
 * @module Styleguide
 */
const Styleguide = angular.module('Styleguide', [
    'ui.router',
    'ui.bootstrap',
    'Styleguide.Colors',
    'Styleguide.Typography',
    'Styleguide.Buttons',
    'Styleguide.Forms',
    'Styleguide.Custom'
]);

Styleguide.config(StyleguideState);

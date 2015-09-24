import StyleguideState from './state.js';
import StyleguideDialogs from './dialogs';
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
    'Styleguide.Dialogs',
    'Styleguide.Colors',
    'Styleguide.Typography',
    'Styleguide.Buttons',
    'Styleguide.Forms',
    'Styleguide.Custom'
]);

Styleguide.config(StyleguideState);

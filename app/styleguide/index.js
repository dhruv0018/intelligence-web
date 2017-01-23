import StyleguideState from './state.js';
import StyleguideIntroduction from './introduction';
import StyleguideButtons from './buttons';
import StyleguideDropdowns from './dropdowns';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide
 * @module Styleguide
 */
const Styleguide = angular.module('Styleguide', [
    'ui.router',
    'ui.bootstrap',
    'Styleguide.Introduction',
    'Styleguide.Buttons',
    'Styleguide.Dropdowns'
]);

Styleguide.config(StyleguideState);

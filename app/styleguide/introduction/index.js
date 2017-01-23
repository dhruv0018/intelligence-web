import StyleguideIntroductionState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Introduction
 * @module StyleguideIntroduction
 */
const StyleguideIntroduction = angular.module('Styleguide.Introduction', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideIntroduction.config(StyleguideIntroductionState);

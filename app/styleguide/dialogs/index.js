import StyleguideDialogsState from './state.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Styleguide Dialogs
 * @module Styleguide.Dialogs
 */
const StyleguideDialogs = angular.module('Styleguide.Dialogs', [
    'ui.router',
    'ui.bootstrap'
]);

StyleguideDialogs.config(StyleguideDialogsState);

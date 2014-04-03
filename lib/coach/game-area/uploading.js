require('game-info');
require('your-team');
require('opposing-team');
require('instructions');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Information page module.
 * @module GameArea
 */
var GameAreaInformation = angular.module('game-area-information', [
    'ui.router',
    'ui.bootstrap',
    'game-info',
    'your-team',
    'opposing-team',
    'instructions'
]);
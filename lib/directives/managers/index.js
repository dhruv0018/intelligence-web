/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var rosterManager = require('roster-manager');
var assistantManager = require('assistant-manager');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Managers
 * @module Managers
 */
var Managers = angular.module('managers', [
    'roster-manager',
    'assistant-manager'
]);
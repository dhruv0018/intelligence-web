/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
import AssistantManager from './assistant-manager/index.js';
import RosterManager from './roster-manager/index.js';

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

export default Managers;

/* Component resources */
var assistantInfo = require('assistant-info');
var athleteInfo = require('athlete-info');

/* Fetch angular from the browser scope */
var angular = window.angular;


/**
 * Info  module.
 * @module Info
 */
var Info = angular.module('Info', [
    'AssistantInfo',
    'AthleteInfo'
]);




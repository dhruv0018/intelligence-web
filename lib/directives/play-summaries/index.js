/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'play-summary.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlaySummaries
 * @module PlaySummaries
 */
var PlaySummaries = angular.module('PlaySummaries', []);

/* Cache the template file */
PlaySummaries.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PlaySummaries directive.
 * @module PlaySummaries
 * @name PlaySummaries
 * @type {directive}
 */
PlaySummaries.directive('krossoverPlaySummaries', [
    function directive() {

        var PlaySummaries = {

            restrict: TO += ELEMENTS,

            scope: {

                events: '='
            },

            templateUrl: templateUrl
        };

        return PlaySummaries;
    }
]);

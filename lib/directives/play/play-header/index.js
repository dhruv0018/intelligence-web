/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'play-header.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlayHeader
 * @module PlayHeader
 */
var PlayHeader = angular.module('PlayHeader', [
    'ui.bootstrap'
]);

/* Cache the template file */
PlayHeader.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PlayHeader directive.
 * @module PlayHeader
 * @name PlayHeader
 * @type {directive}
 */
PlayHeader.directive('playHeader', [
    function directive() {

        var Play = {

            restrict: TO += ELEMENTS,

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {
            console.log('working');
        }
        return Play;
    }
]);

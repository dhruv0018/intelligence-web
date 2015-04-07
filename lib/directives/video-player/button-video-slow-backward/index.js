/* Constants */
let TO = '';
let ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
let template = require('./template.html');
let templateUrl = 'button-video-slow-backward.html';

/**
 * ButtonVideoSlowBackward
 * @module ButtonVideoSlowBackward
 */
let ButtonVideoSlowBackward = angular.module('ButtonVideoSlowBackward', []);

/* Cache the template file */
ButtonVideoSlowBackward.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * ButtonVideoSlowBackward directive.
 * @module Videoplayer
 * @name ButtonVideoSlowBackward
 * @type {directive}
 */
ButtonVideoSlowBackward.directive('buttonVideoSlowBackward', [
    function directive() {

        let definition = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            link: link
        };

        function link($scope, element, attributes, controller) {

        }

        return definition;
    }
]);

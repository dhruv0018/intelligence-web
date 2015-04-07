/* Constants */
let TO = '';
let ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
let template = require('./template.html');
let templateUrl = 'button-video-slow-forward.html';

/**
 * ButtonVideoSlowForward
 * @module ButtonVideoSlowForward
 */
let ButtonVideoSlowForward = angular.module('ButtonVideoSlowForward', []);

/* Cache the template file */
ButtonVideoSlowForward.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * ButtonVideoSlowForward directive.
 * @module Videoplayer
 * @name ButtonVideoSlowForward
 * @type {directive}
 */
ButtonVideoSlowForward.directive('buttonVideoSlowForward', [
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

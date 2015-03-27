/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PublishUserProfileReel
 * @module PublishUserProfileReel
 */
var PublishUserProfileReel = angular.module('PublishUserProfileReel', []);

/* Cache the template file */
PublishUserProfileReel.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('publishUserProfileReel.html', template);
    }
]);

/**
 * PublishUserProfileReel directive.
 * @module PublishUserProfileReel
 * @name PublishUserProfileReel
 * @type {directive}
 */
PublishUserProfileReel.directive('publishUserProfileReel', [
    function directive() {

        var publishUserProfileReel = {

            restrict: TO += ELEMENTS,

            scope: {

                user: '=',
                reel: '='
            },

            controller: 'PublishUserProfileReel.Controller',

            templateUrl: 'publishUserProfileReel.html',
        };

        return publishUserProfileReel;
    }
]);

/* File dependencies */
require('./controller');

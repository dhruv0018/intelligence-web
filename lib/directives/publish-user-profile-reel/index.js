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
var PublishUserProfileReel = angular.module('publishUserProfileReel', []);

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

            templateUrl: 'publishUserProfileReel.html',
        };

        return publishUserProfileReel;
    }
]);

/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;
import PublishUserProfileReelController from './controller';

/**
 * PublishUserProfileReel
 * @module PublishUserProfileReel
 */
var PublishUserProfileReel = angular.module('PublishUserProfileReel', []);

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

            controller: PublishUserProfileReelController,

            templateUrl: 'lib/directives/publish-user-profile-reel/template.html',
        };

        return publishUserProfileReel;
    }
]);

export default PublishUserProfileReel;

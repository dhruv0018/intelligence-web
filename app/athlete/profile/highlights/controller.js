/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile.Highlights page module.
 * @module Profile.Highlights
 */
var Highlights = angular.module('Athlete.Profile.Highlights');

/**
 * Profile.Highlights controller.
 * @module Profile.Highlights
 * @name Profile.Highlights.controller
 * @type {controller}
 */
Highlights.controller('Athlete.Profile.Highlights.controller', [
    '$scope', 'ReelsFactory',
    function controller($scope, reels) {

        $scope.reels = reels.getByUploaderUserId();
    }
]);

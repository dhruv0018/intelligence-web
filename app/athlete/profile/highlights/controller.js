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
    '$scope', '$stateParams', 'ReelsFactory', 'UsersFactory',
    function controller($scope, $stateParams, reels, users) {
        let user = users.get($stateParams.id);
        $scope.reels = reels.getFeaturedReel(user);
    }
]);

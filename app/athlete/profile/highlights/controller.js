/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile.Highlights page module.
 * @module Profile.Highlights
 */
var Highlights = angular.module('Athlete.Profile.Highlights');

/**
 * Profile.Highlights dependencies
 */
HighlightsController.$inject = [
    '$scope',
    '$stateParams',
    'ReelsFactory',
    'UsersFactory',
    'PlaysFactory'
];

/**
 * Profile.Highlights controller.
 * @module Profile.Highlights
 * @name Profile.Highlights.controller
 * @type {controller}
 */
function HighlightsController (
    $scope,
    $stateParams,
    reels,
    users,
    plays
)   {
        let user = users.get($stateParams.id);
        $scope.featuredReel = reels.getFeaturedReel(user);

        let play = plays.get($scope.featuredReel.plays[0]);
        $scope.sources = play.getVideoSources();

        $scope.highlightReels = [];
}

Highlights.controller('Athlete.Highlights.controller', HighlightsController);

export default HighlightsController;

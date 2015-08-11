/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Profile.Highlights page module.
 * @module Profile.Highlights
 */
const Highlights = angular.module('Athlete.Profile.Highlights');

/**
 * Profile.Highlights dependencies
 */
HighlightsController.$inject = [
    '$scope',
    '$stateParams',
    'config',
    'ReelsFactory',
    'UsersFactory',
    'PlaysFactory',
    'PlaysManager'
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
    config,
    reels,
    users,
    plays,
    playsManager
)   {
        $scope.athlete = users.get($stateParams.id);
        $scope.featuredReel = reels.getFeaturedReel($scope.athlete);
        $scope.config = config;

        if ($scope.featuredReel) {

            // Populate the array with play objects from playIds
            $scope.playsArray = $scope.featuredReel.plays.map(function(playId) {
                return plays.get(playId);
            });

            /* Load the plays in the plays manager
             * TODO: accomplish this without playsManager
             */
            playsManager.reset($scope.playsArray);
        }

        $scope.highlightReels = [];
}

Highlights.controller('Athlete.Profile.Highlights.controller', HighlightsController);

export default HighlightsController;

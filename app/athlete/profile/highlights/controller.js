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
    'PlaysFactory',
    'PlaysManager',
    'VideoPlayer'
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
    plays,
    playsManager,
    videoPlayer
)   {
        $scope.athlete = users.get($stateParams.id);
        $scope.featuredReel = reels.getFeaturedReel($scope.athlete);

        if ($scope.featuredReel) {

            // Populate the array with play objects from playIds
            let playsArray = $scope.featuredReel.plays.map(function(playId) {
                return plays.get(playId);
            });

            // Load the plays in the plays manager
            playsManager.reset(playsArray);

            // Start with first play
            $scope.currentPlay = playsArray[0];
            $scope.sources = $scope.currentPlay.getVideoSources();
            $scope.clipTotal = $scope.featuredReel.plays.length;
            $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;

            $scope.$watch('clipIndex', function updatePlayInfo() {
                // When clip index is changed, change that oh
                $scope.previousPlay = playsManager.getPreviousPlay($scope.currentPlay);
                $scope.nextPlay = playsManager.getNextPlay($scope.currentPlay);
            });
        }

        $scope.goToPlay = function goToPlay(play) {
            $scope.currentPlay = play;

            // Replace video sources
            $scope.sources = $scope.currentPlay.getVideoSources();
            videoPlayer.changeSource($scope.sources);

            // Change clip index to reflect current play
            $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;
        };

        $scope.highlightReels = [];
}

Highlights.controller('Athlete.Profile.Highlights.controller', HighlightsController);

export default HighlightsController;

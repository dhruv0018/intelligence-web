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

        let playsArray = [];

        // Populate the array with play objects from playIds
        for (let i = 0; i < $scope.featuredReel.plays.length; i++) {
            let play = plays.get($scope.featuredReel.plays[i]);
            playsArray.push(play);
        }

        // Load the plays in the plays manager
        playsManager.reset(playsArray);
        $scope.currentPlay = playsArray[0];
        $scope.clipTotal = $scope.featuredReel.plays.length;

        $scope.$watch('currentPlay', function updatePlayInfo() {
            $scope.sources = $scope.currentPlay.getVideoSources();
            videoPlayer.changeSource($scope.sources);
            //Featured reel clip information
            $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;
            $scope.previousPlay = playsManager.getPreviousPlay($scope.currentPlay);
            $scope.nextPlay = playsManager.getNextPlay($scope.currentPlay);
        });

        $scope.highlightReels = [];
}

Highlights.controller('Athlete.Profile.Highlights.controller', HighlightsController);

export default HighlightsController;

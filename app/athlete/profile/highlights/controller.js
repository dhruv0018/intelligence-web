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
    'PlaysManager',
    'SessionService',
    'Utilities',
    'ManageProfileReels.Modal'
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
    playsManager,
    session,
    utils,
    manageProfileReelsModal
)   {
        $scope.athlete = users.get($stateParams.id);
        $scope.profileReels = utils.getSortedArrayByIds(reels, $scope.athlete.profile.reelIds);
        $scope.featuredReel = $scope.profileReels[0];
        $scope.config = config;
        $scope.options = {scope: $scope};

        // Check if user is on their own profile
        $scope.isCurrentUser = $scope.athlete.id === session.getCurrentUserId();

        getPlaysArray();

        function getPlaysArray() {
            if ($scope.featuredReel) {

                // Populate the array with play objects from playIds
                $scope.playsArray = $scope.featuredReel.plays.map(function(playId) {
                    return plays.get(playId);
                });

                // Replace current video
                $scope.video = $scope.playsArray[0].clip;
            }
        }

        $scope.manageReels = function() {
            let modal = manageProfileReelsModal.open({
                options: $scope.options
            });

            modal.result.then( () => {
                $scope.athlete = users.get($stateParams.id);
                $scope.profileReels = utils.getSortedArrayByIds(reels, $scope.athlete.profile.reelIds);
                $scope.featuredReel = $scope.profileReels[0];

                if ($scope.featuredReel) {
                    plays.query({reelId: $scope.featuredReel.id}).then(getPlaysArray);
                }
            });
        };
}

Highlights.controller('Athlete.Profile.Highlights.controller', HighlightsController);

export default HighlightsController;

const angular = window.angular;

/**
 * Manage Profile Reels controller class
 * @class ManageProfileReels
 */

ManageProfileReelsController.$inject = [
    '$scope',
    '$state',
    '$uibModalInstance',
    'Utilities',
    'GamesFactory',
    'ReelsFactory',
    'SessionService',
    'DetectDeviceService'
];

function ManageProfileReelsController (
    $scope,
    $state,
    $uibModalInstance,
    utils,
    games,
    reels,
    session,
    device
) {
    $scope.currentUser = session.getCurrentUser();
    $scope.filters = {};
    $scope.reordering = false;
    $scope.isMobile = device.mobile();

    // Get only reels for this athlete's role
    $scope.reels = reels.getUserReels();

    $scope.profileReels = utils.getSortedArrayByIds(reels, $scope.currentUser.profile.reelIds);
    $scope.nonProfileReels = [];
    updateProfileReels();

    function updateProfileReels() {
        $scope.nonProfileReels = [];
        let profileReelsIds = {};

        /* Add profile reel ids to map */
        if ($scope.profileReels.length) {
            $scope.profileReels.forEach(reel => profileReelsIds[reel.id] = true);
        }

        /* Update non profile reels to reflect all reels that aren't on this athlete's profile */
        $scope.reels.forEach(reel => {
            if (!profileReelsIds[reel.id] && !reel.isDeleted) {
                $scope.nonProfileReels.push(reel);
            }
        });
    }

    $scope.addReelToProfile = function(reel) {
        if (!$scope.profileReels.some(profileReel => profileReel.id === reel.id)) {
            $scope.profileReels.push(reel);
        }
        updateProfileReels();
    };

    $scope.removeReelFromProfile = function(reel) {
        $scope.profileReels = $scope.profileReels.filter(profileReel => profileReel.id !== reel.id);
        updateProfileReels();
    };

    $scope.saveProfile = function() {
        let profileReelIds = $scope.profileReels.map(profileReel => profileReel.id);
        $scope.currentUser.profile.reelIds = profileReelIds;

        $scope.currentUser.save().then( () => $uibModalInstance.close());
    };
}

export default ManageProfileReelsController;

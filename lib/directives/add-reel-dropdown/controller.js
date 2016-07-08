const angular = window.angular;
const moment = require('moment');

AddReelDropdownController.$inject = [
    '$scope',
    '$filter',
    'Utilities',
    'ReelsFactory',
    'SessionService',
    'ROLES',
    'AnalyticsService'
];

function AddReelDropdownController (
    $scope,
    $filter,
    utilities,
    reels,
    session,
    ROLES,
    analytics
) {

    let uploaderUserId = session.currentUser.id;
    let uploaderTeamId = session.currentUser.is(ROLES.ATHLETE) ? null : session.getCurrentTeamId();

    $scope.searchFilters = {};
    $scope.filteredReels = [];
    $scope.selectedReels = [];
    $scope.availableReels = [];
    $scope.newReelName = null;
    $scope.isCreatingNewReel = false;
    $scope.isAddingToReel = false;
    $scope.addSuccess = false;

    const getUserReels = function getUserReels() {
        let userReels = reels.getUserReels();

        userReels = userReels.filter(reel => !reel.isDeleted);
        // Make sure there are no duplicates
        let reelIds = utilities.unique(reels.getIds(userReels));
        userReels = reels.getList(reelIds);

        return userReels;
    };

    $scope.userReels = getUserReels();

    const getPlayIds = function getPlayIds() {
        return $scope.plays.map(play => play.id);
    };

    const isSelfEditedPlayIncluded = function isSelfEditedPlayIncluded(play) {
        return $scope.plays.some(play => reel.isSelfEdited === true);
    };

    const isReelSelected = function isReelSelected(reel) {
        return $scope.selectedReels.some(selectedReel => reel.id === selectedReel.id);
    };

    const selectReel = function selectReel(reel) {
        if (!isReelSelected(reel)) {
            $scope.selectedReels.push(reel);
        }
    };
    $scope.selectReel = selectReel;

    const updateAvailableReels = function updateAvailableReels() {
        $scope.availableReels = [];

        /* Update available reels to reflect all reels that aren't selected */
        $scope.availableReels = $scope.userReels.filter(reel => !isReelSelected(reel));

        /* Sort available reels alphabetically */
        $scope.availableReels.sort( (a, b) => {
            return a.name.localeCompare(b.name);
        });

        updateFilteredReels();
    };
    $scope.updateAvailableReels = updateAvailableReels;

    const updateFilteredReels = function updateFilteredReels() {
        $scope.filteredReels = $filter('filter')($scope.availableReels, $scope.searchFilters, false);
    };

    const reset = function reset() {
        $scope.searchFilters = {};
        $scope.availableReels = [];
        $scope.selectedReels = [];
        $scope.isAddingToReel = false;
        $scope.isCreatingNewReel = false;
    };

    $scope.$watch('selectedReels.length', updateAvailableReels);

    $scope.startCreatingNewReel = function startCreatingNewReel() {
        $scope.isCreatingNewReel = true;
        $scope.newReelName = null;
    };

    $scope.cancelCreatingNewReel = function cancelCreatingNewReel() {
        $scope.newReelName = null;
        $scope.isCreatingNewReel = false;
    };

    $scope.createReel = function createReel(name) {
        // Return if there is no reel name
        if (!name || name === '') {
            return;
        }
        $scope.isAddingToReel = true;
        let reel = reels.create({
            name,
            uploaderUserId,
            uploaderTeamId,
            plays: getPlayIds(),
            updatedAt: moment.utc().toDate()
        });
        $scope.selectedReels.push(reel);
        $scope.newReelName = null;
        addToReel();
    };

    $scope.cancel = function cancel() {
        reset();
        $scope.addSuccess = false;
        $scope.dropdownStatus.isopen = false;
    };

    const addToReel = function addToReel() {
        if (!$scope.selectedReels.length) {
            return;
        }
        $scope.isAddingToReel = true;
        $scope.selectedReels = $scope.selectedReels.map(selectedReel => {
            selectedReel.addPlays(getPlayIds());
            selectedReel.updateDate();
            return selectedReel;
        });
        reels.batchSave($scope.selectedReels).then((updatedReels) => {
            trackAnalytics(updatedReels);
            $scope.userReels = getUserReels();
            $scope.addSuccess = true;
            reset();
            updateAvailableReels();
        });
    };

    const trackAnalytics = function trackAnalytics(updatedReels) {
        let playIds = getPlayIds();
        let reelPlays = playIds.length + ' Clip(s) added';
        updatedReels.forEach((reel) => {
            let reelName = reel.name;
            analytics.track('Clip Added to Reel', {
                'Number of Clips Added': reelPlays,
                'Reel Name': reelName
            });
        });
    };

    $scope.addToReel = addToReel;
}

export default AddReelDropdownController;

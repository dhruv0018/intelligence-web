
/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ManageProfileReels page module.
 * @module ManageProfileReels
 */
const ManageProfileReels = angular.module('ManageProfileReels', [
    'ui.bootstrap'
]);

/* Cache the template file */
ManageProfileReels.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('manage-profile-reels.html', template);
    }
]);

/**
 * ManageProfileReels Modal
 * @module ManageProfileReels
 * @name ManageProfileReels.Modal
 * @type {service}
 */
ManageProfileReels.value('ManageProfileReels.ModalOptions', {

    templateUrl: 'manage-profile-reels.html',
    controller: 'ManageProfileReels.controller',
    size: 'md'
});


/**
 * ManageProfileReels modal dialog.
 * @module ManageProfileReels
 * @name ManageProfileReels.Modal
 * @type {service}
 */
ManageProfileReels.service('ManageProfileReels.Modal',[
    '$modal', 'ManageProfileReels.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(options) {

                options = options || {};
                angular.extend(modalOptions, options);

                return $modal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

/**
 * ManageProfileReels controller.
 * @module ManageProfileReels
 * @name ManageProfileReels.controller
 * @type {controller}
 */
ManageProfileReels.controller('ManageProfileReels.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    'Utilities',
    'GamesFactory',
    'ReelsFactory',
    'SessionService',
    'DetectDeviceService',
    function controller($scope,
        $state,
        $modalInstance,
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

            $scope.currentUser.save().then( () => $modalInstance.close());
        };
    }
]);

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
    function controller($scope,
        $state,
        $modalInstance,
        utilities,
        games,
        reels,
        session
    ) {

        $scope.currentUser = session.getCurrentUser();
        $scope.filters = {};
        $scope.reordering = false;

        // Get only reels for this athlete's role
        $scope.reels = reels.getUserReels();

        $scope.profileReels = [];
        $scope.nonProfileReels = [];
        updateProfileReels();

        function updateProfileReels() {
            $scope.profileReels = reels.getSortedProfileReels($scope.currentUser);

            $scope.nonProfileReels = [];
            let reelIdMap = {};

            /* Add profile reel ids to map */
            if ($scope.profileReels.length) {
                $scope.profileReels.forEach(reel => reelIdMap[reel.id] = true);
            }

            /* Update non profile reels to reflect all reels that aren't on this athlete's profile */
            $scope.reels.forEach(reel => {
                if (!reelIdMap[reel.id]) {
                    $scope.nonProfileReels.push(reel);
                }
            });
        }

        $scope.addReelToProfile = function(reel) {
            reel.publishToProfile($scope.currentUser);
            updateProfileReels();
        };

        $scope.removeReelFromProfile = function(reel) {
            reel.unpublishFromProfile($scope.currentUser);
            updateProfileReels();
        };

        $scope.reorderProfileReels = function() {
            let sortedProfileReelIds = [];
            $scope.profileReels.forEach( (reel, index) => {
                $scope.currentUser.profile.reelIds.forEach(reelId => {
                    if (reel.id === reelId) {
                        sortedProfileReelIds[index] = reelId;
                    }
                });
            });
            $scope.currentUser.profile.reelIds = sortedProfileReelIds;
            $scope.reordering = false;
        };

        $scope.saveProfile = function() {
            $scope.currentUser.save().then( () => $modalInstance.close());
        };
    }
]);

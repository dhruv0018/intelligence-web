/* Fetch angular from the browser scope */
var angular = window.angular;

PublishUserProfileReelController.$inject = [
    '$scope',
    'BasicModals',
    '$timeout'
];

/**
 * PublishUserProfileReel controller.
 * @module PublishUserProfileReel
 * @name PublishUserProfileReel
 * @type {controller}
 */
function PublishUserProfileReelController($scope, modals, $timeout) {

    $scope.publishing = false;

    $scope.toggleReelPublishing = function() {
        $scope.publishing = true;
        $scope.confirmPublish = false;

        if ($scope.reel.isPublishedToProfile($scope.user)) {
            // Remove from published reels
            $scope.reel.unpublishFromProfile($scope.user);
            $scope.user.save();
        } else {
            // Publish to profile
            $scope.reel.publishToProfile($scope.user);
            $scope.user.save();
        }

        $timeout(function() {
            $scope.confirmPublish = true;
        }, 1000);
        $timeout(function() {
            $scope.publishing = false;
        }, 2000);
    };

    $scope.savePublishedReel = function() {
        //To be used when multiple reels can be published to profile
        $scope.user.setFeaturedReelId($scope.reel.id);
        $scope.user.save();
    };
}

export default PublishUserProfileReelController;

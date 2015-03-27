/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PublishUserProfileReel
 * @module PublishUserProfileReel
 */
var PublishUserProfileReel = angular.module('PublishUserProfileReel');

/**
 * PublishUserProfileReel controller.
 * @module PublishUserProfileReel
 * @name PublishUserProfileReel
 * @type {controller}
 */
PublishUserProfileReel.controller('PublishUserProfileReel.Controller', [
    '$scope', 'BasicModals', '$timeout',
    function controller($scope, modals, $timeout) {

        $scope.publishing = false;

        $scope.toggleReelPublishing = function() {
            $scope.publishing = true;
            $scope.confirmPublish = false;

            //TODO: use publishToProfile
            if ($scope.reel.isFeatured($scope.user)) {
                $scope.user.setFeaturedReelId(null);
                $scope.user.save();
            } else if (!$scope.reel.isFeatured($scope.user)) {
                //Ask user if they want to replace an already published reel
                if ($scope.user.getFeaturedReelId()) {
                    var publishReelConfirmModal = modals.openForConfirm({
                        title: 'Posting Reel',
                        bodyText: 'Do you want to replace the current reel on the profile page with this one?',
                        buttonText: 'Post Reel'
                    });

                    publishReelConfirmModal.result.then(function() {
                        $scope.savePublishedReel();
                    });
                } else {
                    $scope.savePublishedReel();
                }
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
]);

/* Component resources */
const template = require('./template.html');
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * QaPickup page module.
 * @module QaPickup
 */
const QaPickup = angular.module('QaPickup', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
QaPickup.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('qa-pickup.html', template);
    }
]);

/**
 * QaPickup Modal
 * @module QaPickup
 * @name QaPickup.Modal
 * @type {service}
 */
QaPickup.value('QaPickup.ModalOptions', {

    templateUrl: 'qa-pickup.html',
    controller: 'QaPickup.controller',
    size: 'sm'
});


/**
 * QaPickup modal dialog.
 * @module QaPickup
 * @name QaPickup.Modal
 * @type {service}
 */
QaPickup.service('QaPickup.Modal',[
    '$modal', 'QaPickup.ModalOptions',
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
 * QaPickup controller.
 * @module QaPickup
 * @name QaPickup.controller
 * @type {controller}
 */
QaPickup.controller('QaPickup.controller', [
    '$scope', '$state', '$modalInstance', 'Utilities', 'GamesFactory', 'ReelsFactory', 'SessionService', 'AlertsService', 'ROLES',
    function controller($scope, $state, $modalInstance, utilities, games, reels, session, alerts, ROLES) {

        // $scope.hasReels = false;
        // $scope.isNaming = false;
        // $scope.addSuccess = false;
        // $scope.newReelName = '';
        //
        // // Get play ids for each selected play
        // $scope.playIds = [];
        // $scope.selectedPlays.forEach(play => $scope.playIds.push(play.id));
        //
        // //Create new array that does not include reels shared with user
        // $scope.userReels = [];
        //
        // if (session.currentUser.is(ROLES.COACH)) {
        //
        //     $scope.userReels = $scope.userReels.concat(reels.getByUploaderRole());
        //     $scope.userReels = $scope.userReels.concat(reels.getByUploaderTeamId());
        // }
        //
        // else if (session.currentUser.is(ROLES.ATHLETE)) {
        //
        //     $scope.userReels = $scope.userReels.concat(reels.getByUploaderUserId());
        // }
        //
        // $scope.userReels = $scope.userReels.filter(function(reel) {
        //
        //     return !reel.isDeleted;
        // });
        //
        // // Make sure there are no duplicates
        // let reelIds = utilities.unique(reels.getIds($scope.userReels));
        //
        // $scope.userReels = reels.getList(reelIds);
        //
        // $scope.reel = $scope.userReels[0];
        //
        // if ($scope.userReels.length > 0) {
        //     $scope.hasReels = true;
        // }
        //
        // let uploaderUserId = session.currentUser.id;
        // let uploaderTeamId = session.currentUser.is(ROLES.ATHLETE) ? null : session.currentUser.currentRole.teamId;
        //
        // $scope.createReel = function(name) {
        //     let reel = reels.create({
        //         name,
        //         uploaderUserId,
        //         uploaderTeamId,
        //         plays: $scope.playIds,
        //         updatedAt: moment.utc().toDate()
        //     });
        //     reel.save();
        //     $scope.addSuccess = true;
        // };
        //
        // $scope.addToReel = function(reel) {
        //     reel.addPlays($scope.playIds);
        //     reel.updateDate();
        //     reel.save();
        //     $scope.addSuccess = true;
        // };
    }
]);

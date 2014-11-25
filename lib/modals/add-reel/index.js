/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AddReel page module.
 * @module AddReel
 */
var AddReel = angular.module('AddReel', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AddReel.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('add-reel.html', template);
    }
]);

/**
 * AddReel Modal
 * @module AddReel
 * @name AddReel.Modal
 * @type {service}
 */
AddReel.value('AddReel.ModalOptions', {

    templateUrl: 'add-reel.html',
    controller: 'AddReel.controller',
    size: 'sm'
});


/**
 * AddReel modal dialog.
 * @module AddReel
 * @name AddReel.Modal
 * @type {service}
 */
AddReel.service('AddReel.Modal',[
    '$modal', 'AddReel.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

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
 * AddReel controller.
 * @module AddReel
 * @name AddReel.controller
 * @type {controller}
 */
AddReel.controller('AddReel.controller', [
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'ReelsFactory', 'SessionService', 'AlertsService', 'ROLES',
    function controller($scope, $state, $modalInstance, games, reels, session, alerts, ROLES) {
        $scope.hasReels = false;
        $scope.isNaming = false;
        $scope.addSuccess = false;
        $scope.newReelName = '';

        //Create new array that does not include reels shared with user
        $scope.userReels = reels.getMyReels($scope.reels);

        $scope.reel = $scope.userReels[0];

        if ($scope.userReels.length > 0) {
            $scope.hasReels = true;
        }

        var uploaderUserId = session.currentUser.id;
        var uploaderTeamId = session.currentUser.is(ROLES.ATHLETE) ? null : session.currentUser.currentRole.teamId;

        $scope.createReel = function(name) {
            var reel = reels.create({
                name: name,
                uploaderUserId: uploaderUserId,
                uploaderTeamId: uploaderTeamId,
                plays: [$scope.play.id],
                updatedAt: moment.utc().toDate()
            });
            reel.save();
            $scope.addSuccess = true;
        };

        $scope.addToReel = function(reel, play) {
            reel.addPlay(play);
            reel.updateDate();
            reel.save();
            $scope.addSuccess = true;
        };
    }
]);


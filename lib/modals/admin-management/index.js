/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AdminManagement page module.
 * @module AdminManagement
 */
var AdminManagement = angular.module('AdminManagement', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AdminManagement.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('admin-management.html', template);
    }
]);

/**
 * AdminManagement Modal
 * @module AdminManagement
 * @name AdminManagement.Modal
 * @type {service}
 */
AdminManagement.value('AdminManagement.ModalOptions', {

    templateUrl: 'admin-management.html',
    controller: 'AdminManagement.controller'
});


/**
 * AdminManagement modal dialog.
 * @module AdminManagement
 * @name AdminManagement.Modal
 * @type {service}
 */
AdminManagement.service('AdminManagement.Modal',[
    '$modal', 'AdminManagement.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(game) {
                var resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * AdminManagement controller.
 * @module AdminManagement
 * @name AdminManagement.controller
 * @type {controller}
 */
AdminManagement.controller('AdminManagement.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    'Game',
    'GAME_STATUSES',
    'UsersFactory',
    'DeleteGame.Modal',
    'SelectIndexer.Modal',
    'EMAIL_REQUEST_TYPES',
    'SessionService',
    function controller(
        $scope,
        $state,
        $modalInstance,
        game,
        GAME_STATUSES,
        users,
        DeleteGameModal,
        SelectIndexerModal,
        EMAIL_REQUEST_TYPES,
        session
    ) {

        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.game = game;

        //breaks the reference to the assignment on purpose
        //otherwise date is updated every increment which leads to dramatic amounts of extra time
        $scope.assignment = angular.copy(game.currentAssignment());

        $scope.management = {
            extendedDeadline: {}
        };

        $scope.extendIndexerDeadline = function() {
            var currentAssignment = $scope.game.currentAssignment();
            currentAssignment.deadline = $scope.management.extendedDeadline;
            $scope.game.save().then(function() {
                $modalInstance.close();
            });
        };

        if ($scope.assignment) {
            $scope.currentIndexer = users.get($scope.assignment.userId);
        }

        $scope.adminManagementModal = $modalInstance;
        DeleteGameModal.setScope($scope);

        $scope.reassignIndexer = function() {
            game.unassign();
            SelectIndexerModal.open(game, false).result.finally(function() {
                $modalInstance.close();
            });
        };

        $scope.reassignQAer = function() {
            game.unassign();
            SelectIndexerModal.open(game, true).result.finally(function() {
                $modalInstance.close();
            });
        };

        $scope.save = function() {

            const roleId = session.getCurrentRoleId();
            const gameId = game.id;
            const userId = session.getCurrentUserId();

            $scope.game.setAside();
            $scope.game.save();
            users.resendEmail(EMAIL_REQUEST_TYPES.SET_ASIDE_EMAIL, {roleType: roleId, gameId: gameId}, userId);
            $modalInstance.close();
        };
    }
]);

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CopyGame page module.
 * @module CopyGame
 */
const CopyGame = angular.module('CopyGame', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
CopyGame.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('copy-game.html', template);
    }
]);

/**
 * CopyGame Modal
 * @module CopyGame
 * @name CopyGame.Modal
 * @type {service}
 */
CopyGame.value('CopyGame.ModalOptions', {

    templateUrl: 'copy-game.html',
    controller: 'CopyGame.controller'
});


/**
 * CopyGame modal dialog.
 * @module CopyGame
 * @name CopyGame.Modal
 * @type {service}
 */
CopyGame.service('CopyGame.Modal',[
    '$modal', 'CopyGame.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(game) {
                const resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                const options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            },
            setScope: function(scope) {
                modalOptions.scope = scope;
            }
        };

        return Modal;
    }
]);

/**
 * CopyGame controller.
 * @module CopyGame
 * @name CopyGame.controller
 * @type {controller}
 */
CopyGame.controller('CopyGame.controller', [
    '$scope', '$state', '$modalInstance', 'Game', 'AlertsService',
    function controller($scope, $state, $modalInstance, game, AlertsService) {
        $scope.statusText = 'Copy now';

        /* TODO: get rid of this alert and use AlertService when it supports alerts specific to modals */
        $scope.alert  = null;
        $scope.teamId = null;

        $scope.copyGame = function() {
            $scope.statusText = 'Working...';
            $scope.alert      = null;
            if (game.isTeamUploadersTeam($scope.teamId)) {
                $scope.setAlert({
                    type: 'danger',
                    message: 'Game not copied. Uploaded by same team'
                });
                return;
            }
            if (!Number.isInteger($scope.teamId)) {
                $scope.setAlert({
                    type: 'danger',
                    message: 'Game not copied. Invalid team id'
                });
            }
            game.copy($scope.teamId).then( function onSuccess() {
                $scope.setAlert({
                    type: 'success',
                    message: 'Game has been copied to team id: ' + $scope.teamId
                });
                $scope.teamId  = null;
                $scope.form.$setPristine();
            }, function (error) {
                $scope.setAlert(AlertsService.alerts.pop());
            });
        };

        $scope.setAlert = function(alert){
            $scope.alert = alert;
            $scope.statusText = 'Copy now';
        };
    }
]);

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
    '$scope', '$state', '$modalInstance', 'Game',
    function controller($scope, $state, $modalInstance, game) {
        $scope.statusText = 'Copy now';

        /* TODO: get rid of this alert and use AlertService when it supports alerts specific to modals */
        $scope.alert  = null;
        $scope.teamId = null;

        $scope.copyGame = function() {
            $scope.statusText = 'Working...';
            $scope.alert      = null;
            if (!Number.isInteger($scope.teamId)) {
                $scope.setAlert('danger', 'Game not copied. Invalid team id');
                return;
            }
            game.copy($scope.teamId).then( function() {
                $scope.setAlert('success', 'Game has been copied to team id: ' + $scope.teamId);
                $scope.teamId  = null;
                $scope.form.$setPristine();
            }, function (error) {
                if (error.status === 404) {
                    $scope.setAlert('warning', 'Game not copied. ' + error.data);
                } else {
                    $scope.setAlert('danger', 'Game not copied.');
                }
            });
        };

        $scope.setAlert = function(type, message){
            $scope.alert = {
                type: type,
                message: message
            };
            $scope.statusText = 'Copy now';
        };
    }
]);

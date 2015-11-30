/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CopyGame page module.
 * @module CopyGame
 */
const CopyRawFilm = angular.module('CopyRawFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
CopyRawFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('copy-raw-film.html', template);
    }
]);

/**
 * CopyRawFilm Modal
 * @module CopyRawFilm
 * @name CopyRawFilm.Modal
 * @type {service}
 */
CopyRawFilm.value('CopyRawFilm.ModalOptions', {

    templateUrl: 'copy-raw-film.html',
    controller: 'CopyRawFilm.controller'
});


/**
 * CopyRawFilm modal dialog.
 * @module CopyRawFilm
 * @name CopyRawFilm.Modal
 * @type {service}
 */
CopyRawFilm.service('CopyRawFilm.Modal',[
    '$modal', 'CopyRawFilm.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(parent) {

                var resolves = {

                    resolve: {

                        Parent: function() { return parent; }
                    }
                };
                //Used to prevent modal from closing on backdrop click
                modalOptions.backdrop = 'static';
                var options = angular.extend(modalOptions, resolves);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * CopyRawFilm controller.
 * @module CopyRawFilm
 * @name CopyRawFilm.controller
 * @type {controller}
 */
CopyRawFilm.controller('CopyRawFilm.controller', [
    '$scope', '$state', '$modalInstance', 'AlertsService', 'Parent',
    function controller($scope, $state, $modalInstance, AlertsService, parent) {

        let game = parent.scope.game;
        $scope.teams = parent.scope.allowedTeams;
        $scope.statusText = 'Copy';

        /* TODO: get rid of this alert and use AlertService when it supports alerts specific to modals */
        $scope.alert  = null;
        $scope.teamId = null;

        $scope.copyGame = function() {
            parent.scope.copyingRawFilm = true;
            $scope.statusText = 'Working...';
            $scope.alert = null;
            if (game.isTeamUploadersTeam($scope.teamId)) {
                $scope.setAlert({
                    type: 'danger',
                    message: 'Game not copied. Uploaded by same team.'
                });
                return;
            }
            if (!Number.isInteger($scope.teamId)) {
                $scope.setAlert({
                    type: 'danger',
                    message: 'Game not copied. Invalid team id.'
                });
            }
            game.copy($scope.teamId, true).then( function onSuccess() {
                $modalInstance.close();
            }, function onError(error) {
                parent.scope.copyingRawFilm = false;
                $scope.setAlert({
                    type: 'danger',
                    message: 'An error has occurred. Game not copied.'
                });
            });
        };

        $scope.setAlert = function(alert){
            $scope.alert = alert;
            $scope.statusText = 'Copy';
        };
    }
]);

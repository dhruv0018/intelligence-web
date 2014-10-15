/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser $scope */
var angular = window.angular;

/**
 * ExcelUpload page module.
 * @module ExcelUpload
 */
var ExcelUpload = angular.module('ExcelUpload', [
    'ui.router',
    'ui.bootstrap'
]);



/* Cache the template file */
ExcelUpload.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('excel-upload.html', template);
    }
]);

/**
 * ExcelUpload Modal
 * @module ExcelUpload
 * @name ExcelUpload.Modal
 * @type {service}
 */
ExcelUpload.value('ExcelUpload.ModalOptions', {

    templateUrl: 'excel-upload.html',
    controller: 'ExcelUpload.controller'
});

/**
 * ExcelUpload modal dialog.
 * @module ExcelUpload
 * @name ExcelUpload.Modal
 * @type {service}
 */
ExcelUpload.service('ExcelUpload.Modal',[
    '$q', '$modal', 'ExcelUpload.ModalOptions',
    function($q, $modal, modalOptions) {

        var Modal = {

            open: function(dataOptions) {
                var options = angular.extend(modalOptions, dataOptions);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * ExcelUpload controller.
 * @module ExcelUpload
 * @name ExcelUpload.controller
 * @type {controller}
 */
ExcelUpload.controller('ExcelUpload.controller', [
    '$http','$scope', '$modalInstance', 'config', 'PlayersFactory', 'TeamsFactory', 'UsersFactory',
    function controller($http, $scope, $modalInstance, config, players, teams, users) {
        $scope.errors = [];

        $scope.uploadRoster = function() {
            var file = $scope.files[0];
            var data = new FormData();

            data.append('rosterId', $scope.rosterId);
            data.append('roster', file);

            $http.post(config.api.uri + 'players/file',

                data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(uploadedPlayers) {
                    var playersCollection = players.getCollection();
                    var userIds = [];
                    //update the cache
                    uploadedPlayers.forEach(function(player) {
                        playersCollection[player.id] = player;
                        userIds.push(player.userId);
                    });

                    teams.fetch($scope.team.id).then(function(team) {
                        angular.extend($scope.team, team);
                        $modalInstance.close();
                    });

                    users.load({
                        'id[]': userIds
                    });

                })
                .error(function(failure) {
                    $scope.errors = [];
                    angular.forEach(failure.errors, function(error, row) {
                        angular.forEach(error, function(issue, field) {
                            $scope.errors.push({
                                row: row,
                                field: field,
                                issue: issue
                            });
                        });
                    });
                });
        };

        $scope.retry = function() {
            $scope.errors = [];
        };

    }
]);


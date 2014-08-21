/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AthleteInfo page module.
 * @module AthleteInfo
 */
var AthleteInfo = angular.module('AthleteInfo', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AthleteInfo.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete-info.html', template);
    }
]);

/**
 * AthleteInfo Modal
 * @module AthleteInfo
 * @name AthleteInfo.Modal
 * @type {service}
 */
AthleteInfo.value('AthleteInfo.ModalOptions', {

    templateUrl: 'athlete-info.html',
    controller: 'AthleteInfo.controller'
});


/**
 * AthleteInfo modal dialog.
 * @module AthleteInfo
 * @name AthleteInfo.Modal
 * @type {service}
 */
AthleteInfo.service('AthleteInfo.Modal',[
    '$modal', 'AthleteInfo.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(dataOptions) {

                var resolves = {
                    resolve: {
                        Athlete: function() {
                            return dataOptions.targetAthlete;
                        }
                    }
                };

                var options = angular.extend(modalOptions, resolves, dataOptions);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * AthleteInfo controller.
 * @module AthleteInfo
 * @name AthleteInfo.controller
 * @type {controller}
 */
AthleteInfo.controller('AthleteInfo.controller', [
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'AlertsService', 'Athlete',
    function controller($scope, $state, $modalInstance, games, alerts, athlete) {
        $scope.keys = window.Object.keys;
        var reader = new FileReader();

        $scope.athlete = athlete;

        $scope.cancel = function() {

            if (!$scope.athlete.id) {
                $scope.toggleActivation($scope.player);
            }

            $modalInstance.close();
        };

        $scope.savePlayer = function() {
            if ($scope.athleteForm.$valid) {
                $scope.save($scope.athlete);
                $modalInstance.close();
            }
        };

        $scope.togglePlayer = function() {
            $scope.toggleActivation($scope.athlete);
            $scope.save($scope.athlete);
            $modalInstance.close();
        };

        $scope.setProfileImage = function(files) {
            $scope.athlete.fileImage = files[0];

            reader.readAsDataURL(files[0]);

            reader.onload = function() {
                $scope.athlete.imageUrl = reader.result;
                console.log($scope.athlete);
                $scope.$apply();
            };
        };
    }
]);


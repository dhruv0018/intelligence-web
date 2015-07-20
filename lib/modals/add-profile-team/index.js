/* Component resources */
const template = require('./template.html');
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * AddProfileTeam page module.
 * @module AddProfileTeam
 */
const AddProfileTeam = angular.module('AddProfileTeam', [
    'ui.bootstrap'
]);

/* Cache the template file */
AddProfileTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('add-profile-team.html', template);
    }
]);

/**
 * AddProfileTeam Modal
 * @module AddProfileTeam
 * @name AddProfileTeam.Modal
 * @type {service}
 */
AddProfileTeam.value('AddProfileTeam.ModalOptions', {

    templateUrl: 'add-profile-team.html',
    controller: 'AddProfileTeam.controller',
    size: 'md'
});


/**
 * AddProfileTeam modal dialog.
 * @module AddProfileTeam
 * @name AddProfileTeam.Modal
 * @type {service}
 */
AddProfileTeam.service('AddProfileTeam.Modal',[
    '$modal', 'AddProfileTeam.ModalOptions',
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
 * AddProfileTeam controller.
 * @module AddProfileTeam
 * @name AddProfileTeam.controller
 * @type {controller}
 */
AddProfileTeam.controller('AddProfileTeam.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    'Utilities',
    'TeamsFactory',
    'SportsFactory',
    'LeaguesFactory',
    'PositionsetsFactory',
    'SessionService',
    function controller($scope,
        $state,
        $modalInstance,
        utilities,
        teams,
        sports,
        leagues,
        positionsets,
        session
    ) {
        $scope.profileTeam = $scope.profileTeam || {};
        $scope.currentUser = session.getCurrentUser();
        $scope.sports = sports.getList();
        $scope.allLeagues = leagues.getList();
        $scope.positionset = {};
        $scope.hideEndYear = false;

        // Initialize temporary team values
        $scope.teamLeague = {};
        $scope.teamSport = {};

        $scope.dates = [];
        let currentYear = Number(moment.utc().year());
        let earliestYear = 1990; // Farthest back we're willing to let athletes pick
        for (let i = currentYear; i >= earliestYear; i--) {
            $scope.dates.push(i);
        }

        $scope.checkPresentlyOnTeam = function() {
            $scope.hideEndYear = !$scope.hideEndYear;
            $scope.profileTeam.endYear = null;
        };

        $scope.getLeagues = function(sportId) {
            $scope.teamLeague = {}; // reset team league
            $scope.profileTeam.positionIds = []; // reset profile position ids
            $scope.leagues = $scope.allLeagues.filter(league => {
                return league.sportId === sportId;
            });
        };

        $scope.getPositionset = function(positionsetId) {
            $scope.profileTeam.positionIds = []; // reset profile position ids
            if (positionsetId) {
                $scope.positionset = positionsets.get(positionsetId);
            } else {
                $scope.positionset = {};
            }
        };

        $scope.formIncomplete = function() {
            /* Custom form validator needed due to irregular fields in form */
            if ($scope.profileTeam.name &&
                $scope.profileTeam.startYear &&
                $scope.teamSport.id &&
                $scope.teamLeague.id &&
                $scope.profileTeam.positionIds.length) {

                if ($scope.hideEndYear) {
                    return false;
                } else if ($scope.profileTeam.endYear >= $scope.profileTeam.startYear) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        };

        $scope.saveProfileTeam = function() {
            $scope.profileTeam.leagueId = $scope.teamLeague.id;
        };
    }
]);

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
    'ATHLETE_PROFILE_TEAM_START_YEARS',
    'profileTeam',
    function controller(
        $scope,
        $state,
        $modalInstance,
        utilities,
        teams,
        sports,
        leagues,
        positionsets,
        session,
        ATHLETE_PROFILE_TEAM_START_YEARS,
        profileTeam
    ) {
        $scope.profileTeam = profileTeam || {};
        $scope.currentUser = session.getCurrentUser();
        $scope.sports = sports.getList();
        $scope.allLeagues = leagues.getList();
        $scope.positionset = {};
        $scope.hideEndYear = false;
        $scope.editingExistingTeam = false;
        $scope.isSaving = false;

        // Initialize temporary team values
        $scope.teamLeague = {};
        $scope.teamSport = {};

        // If editing an existing team, populate fields
        if ($scope.profileTeam.teamId) {
            $scope.editingExistingTeam = true;

            if ($scope.profileTeam.endYear === null) {
                $scope.hideEndYear = true;
            }

            // Get existing team object
            let existingTeam = teams.get($scope.profileTeam.teamId);
            $scope.profileTeam.name = existingTeam.name;

            // Set to existing league and sport
            $scope.teamLeague = leagues.get(existingTeam.leagueId);
            $scope.teamSport = sports.get($scope.teamLeague.sportId);

            // Get list of leagues and positions for dropdowns
            $scope.leagues = $scope.allLeagues.filter(league => {
                return league.sportId === $scope.teamLeague.sportId;
            });
            $scope.positionset = positionsets.get($scope.teamLeague.positionSetId);
        }

        $scope.dates = [];
        let currentYear = Number(moment.utc().year());
        let earliestYear = ATHLETE_PROFILE_TEAM_START_YEARS.EARLIEST; // Farthest back we're willing to let athletes pick
        for (let i = currentYear; i >= earliestYear; i--) {
            $scope.dates.push(i);
        }

        $scope.disableEndYear = function() {
            // Disables profileTeam.endYear to show that the user is still on this team
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

            $scope.isSaving = true;

            if ($scope.editingExistingTeam) {
                updateExistingTeam();
            } else {
                createNewProfileTeam();
            }
        };

        function updateExistingTeam() {
            // Update existing team object
            existingTeam.leagueId = $scope.teamLeague.id;
            existingTeam.name = $scope.profileTeam.name;
            existingTeam.save();

            // Update existing profile team object
            $scope.currentUser.profile.teams.forEach(team => {
                if (team.teamId === $scope.profileTeam.teamId) {
                    team.startYear = $scope.profileTeam.startYear;
                    team.endYear = $scope.profileTeam.endYear;
                    team.positionIds = $scope.profileTeam.positionIds;
                }
            });

            $scope.currentUser.save().then(() => {
                $modalInstance.close();
                $scope.isSaving = false;
            });
        }

        function createNewProfileTeam() {
            // Create new team object
            let createdTeam = teams.create({
                isCustomerTeam: false,
                leagueId: $scope.teamLeague.id,
                name: $scope.profileTeam.name
            });

            createdTeam.save().then(team => {

                // Create new profile team object
                let newProfileTeam = {
                    teamId: team.id,
                    startYear: $scope.profileTeam.startYear,
                    endYear: $scope.profileTeam.endYear,
                    positionIds: $scope.profileTeam.positionIds
                };
                $scope.currentUser.profile.teams.push(newProfileTeam);
                $scope.currentUser.save().then(() => {

                    // Clear all fields
                    $scope.profileTeam = {};
                    $scope.teamLeague = {};
                    $scope.teamSport = {};
                    $modalInstance.close();
                    $scope.isSaving = false;
                });
            });
        }
    }
]);

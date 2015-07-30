/* Component resources */
const template = require('./template.html');
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ProfileOnboarding page module.
 * @module ProfileOnboarding
 */
const ProfileOnboarding = angular.module('ProfileOnboarding', [
    'ui.bootstrap'
]);

/* Cache the template file */
ProfileOnboarding.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('profile-onboarding.html', template);
    }
]);

/**
 * ProfileOnboarding Modal
 * @module ProfileOnboarding
 * @name ProfileOnboarding.Modal
 * @type {service}
 */
ProfileOnboarding.value('ProfileOnboarding.ModalOptions', {

    templateUrl: 'profile-onboarding.html',
    controller: 'ProfileOnboarding.controller',
    size: 'md'
});


/**
 * ProfileOnboarding modal dialog.
 * @module ProfileOnboarding
 * @name ProfileOnboarding.Modal
 * @type {service}
 */
ProfileOnboarding.service('ProfileOnboarding.Modal',[
    '$modal', 'ProfileOnboarding.ModalOptions',
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
 * ProfileOnboarding controller.
 * @module ProfileOnboarding
 * @name ProfileOnboarding.controller
 * @type {controller}
 */
ProfileOnboarding.controller('ProfileOnboarding.controller', [
    '$scope',
    '$state',
    '$filter',
    '$modalInstance',
    'Utilities',
    'UsersFactory',
    'TeamsFactory',
    'SportsFactory',
    'LeaguesFactory',
    'PositionsetsFactory',
    'PlayersFactory',
    'SessionService',
    'ROLE_TYPE',
    function controller(
        $scope,
        $state,
        $filter,
        $modalInstance,
        utilities,
        users,
        teams,
        sports,
        leagues,
        positionsets,
        players,
        session,
        ROLE_TYPE
    ) {
        $scope.currentUser = session.getCurrentUser();
        $scope.teams = [];
        $scope.sports = sports.getList();
        $scope.maxAboutMeLength = 200;

        $scope.currentUser.roles.forEach(role => {
            if (role.type.id === ROLE_TYPE.ATHLETE) {
                let krossoverTeam = teams.get(role.teamId);
                krossoverTeam.isSelected = false;
                krossoverTeam.startYear = role.tenureStart;
                krossoverTeam.endYear = role.tenureEnd;
                $scope.teams.push(krossoverTeam);
            }
        });

        $scope.getTeamCoachName = function(team) {
            let headCoach = users.get(team.getHeadCoachRole().userId);
            return headCoach.firstName + ' ' + headCoach.lastName;
        };

        $scope.getPositionsOnTeam = function(team) {
            let league = leagues.get(team.leagueId);
            let positionset = positionsets.get(league.positionSetId);
            let teamPlayers = $filter('toArray')(team.roster.playerInfo);
            let userPlayers = players.getList({userId: $scope.currentUser.id});
            let positionIds = [];
            userPlayers.forEach(userPlayer => {
                let thisPlayer = teamPlayers.find(teamPlayer => {
                    return Number(teamPlayer.id) === userPlayer.id;
                });

                if (thisPlayer) {
                    thisPlayer.positionIds.forEach(positionId => {
                        positionIds.push(positionId);
                    });
                }
            });

            let positions = [];
            positionIds.forEach(positionId => {
                positions.push(positionset.getPositionById(positionId));
            });

            return positions;

        };
    }
]);

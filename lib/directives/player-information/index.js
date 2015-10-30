/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * PlayerInformation
 * @module PlayerInformation
 */
const PlayerInformation = angular.module('PlayerInformation', []);

/* Cache the template file */
PlayerInformation.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('PlayerInformation.html', template);
    }
]);

/**
 * PlayerInformation directive.
 * @module PlayerInformation
 * @name PlayerInformation
 * @type {Directive}
 */
PlayerInformation.directive('playerInformation', [
    '$http',
    'config',
    'UsersFactory',
    'PlayersFactory',
    'TeamsFactory',
    'PositionsetsFactory',
    'LeaguesFactory',
    'SportsFactory',
    'SessionService',
    'AlertsService',
    'ROLE_TYPE',
    function directive(
        $http,
        config,
        users,
        players,
        teams,
        positionsets,
        leagues,
        sports,
        session,
        alerts,
        ROLE_TYPE
    ) {

        function link(scope) {
            scope.rolesInfo = [];
            scope.currentUser = session.getCurrentUser();
            const currentUserId = session.getCurrentUserId();

            let teamRosters = [];
            let userRoles = session.currentUser.getRoles(ROLE_TYPE.ATHLETE);
            let tempPlayers = [];

            userRoles.forEach(function(role, index) {
                scope.team = teams.get(userRoles[index].teamId);
                let userPlayers = players.getList({userId: currentUserId});
                let teamPlayers = scope.team.roster.playerInfo;
                let league = leagues.get(scope.team.leagueId);
                let positionset = positionsets.get(league.positionSetId);

                Object.keys(teamPlayers).forEach(function(teamPlayerId) {

                    const playerIds = userPlayers.map(player => player.id);

                    if (~playerIds.indexOf(Number(teamPlayerId))) {

                        let thisPlayer = players.get(teamPlayerId);

                        if (thisPlayer.userId == currentUserId) {
                            tempPlayers[index] = thisPlayer;
                        }
                    }
                });

                let positionIds = scope.team.roster.playerInfo[tempPlayers[index].id].positionIds;
                let positions = positionIds.map(positionId => positionset.getPosition(positionId));

                if (tempPlayers[index]) {
                    scope.rolesInfo[index] = {
                        team: scope.team,
                        positions,
                        jerseyNumber: scope.team.roster.playerInfo[tempPlayers[index].id].jerseyNumber,
                        sport: sports.get(league.sportId)
                    };
                }
            });

        }

        const PlayerInformation = {

            restrict: TO += ELEMENTS,

            templateUrl: 'PlayerInformation.html',

            link: link
        };

        return PlayerInformation;
    }
]);

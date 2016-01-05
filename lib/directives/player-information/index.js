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
    'SPORTS',
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
        ROLE_TYPE,
        SPORTS
    ) {

        function link(scope) {
            scope.rolesInfo = [];
            scope.currentUser = session.getCurrentUser();
            const currentUserId = session.getCurrentUserId();

            let teamRosters = [];
            let userRoles = session.currentUser.getRoles(ROLE_TYPE.ATHLETE);
            let tempPlayers = [];
            scope.teams = [];

            userRoles.forEach(function(role, index) {
                let team = teams.get(userRoles[index].teamId);
                if (team.getSport().id === SPORTS.BASKETBALL.id) scope.teams.push(team);
                let userPlayers = players.getList({userId: currentUserId});
                let teamPlayers = team.roster.playerInfo;
                let league = leagues.get(team.leagueId);
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

                let positionIds = team.roster.playerInfo[tempPlayers[index].id].positionIds;
                let positions = positionIds.map(positionId => positionset.getPosition(positionId));

                if (tempPlayers[index]) {
                    scope.rolesInfo[index] = {
                        team,
                        positions,
                        jerseyNumber: team.roster.playerInfo[tempPlayers[index].id].jerseyNumber,
                        sport: sports.get(league.sportId)
                    };
                }
            });

            //Set team and season for WSC Highlight
            scope.team = scope.teams[0];

            scope.$watch('team', teamForHighlight => {
                let leagueForHighlight = leagues.get(teamForHighlight.leagueId);
                let season = leagueForHighlight.getCurrentSeason() || league.getMostRecentSeason();
                if (season) scope.seasonId = season.id;
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

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
            scope.options = {
                scope: scope
            };

            scope.save = function(user) {

                if (user.fileImage) {
                    let data = new FormData();
                    data.append('imageFile', user.fileImage);

                    $http.post(config.api.uri + 'users/' + user.id + '/image/file', data, {
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity
                    })
                        .success(function(responseUser) {
                            scope.user.imageUrl = responseUser.imageUrl;
                            users.save(scope.user).then(function() {
                                alerts.add({
                                    type: 'success',
                                    message: 'Your profile has been saved.'
                                });
                            });
                            delete user.fileImage;
                        })
                        .error(function() {
                            delete scope.user.imageUrl;
                            alerts.add({
                                type: 'danger',
                                message: 'The image upload failed.'
                            });
                        });
                } else {
                    users.save(scope.user).then(function() {
                        alerts.add({
                            type: 'success',
                            message: 'Your profile has been saved.'
                        });
                    });
                }
            };

            let teamRosters = [];
            let userRoles = session.currentUser.roleTypes[ROLE_TYPE.ATHLETE];
            let tempPlayers = [];

            userRoles.forEach(function(role, index) {
                scope.team = teams.get(userRoles[index].teamId);
                let teamPlayers = scope.team.roster.playerInfo;
                let league = leagues.get(scope.team.leagueId);
                let positionset = positionsets.get(league.positionSetId);

                Object.keys(teamPlayers).forEach(function(teamPlayerId) {

                    let playerIds = scope.players.map(function(player) {return player.id;});

                    if (~playerIds.indexOf(Number(teamPlayerId))) {

                        let thisPlayer = players.get(teamPlayerId);

                        if (thisPlayer.userId == session.currentUser.id) {
                            tempPlayers[index] = thisPlayer;
                        }
                    }
                });

                let positionIds = scope.team.roster.playerInfo[tempPlayers[index].id].positionIds;
                let positions = [];

                positionIds.forEach(positionId => {
                    positions.push(positionset.getPositionById(positionId));
                });

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

            scope: {
                players: '=?',
                user: '=?'
            },

            link: link
        };

        return PlayerInformation;
    }
]);

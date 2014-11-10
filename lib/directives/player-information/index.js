/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlayerInformation
 * @module PlayerInformation
 */
var PlayerInformation = angular.module('PlayerInformation', []);

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
    'UsersFactory', 'PlayersFactory', '$http', 'TeamsFactory', 'PositionsetsFactory', 'LeaguesFactory', 'SportsFactory', 'SessionService', 'ROLE_TYPE', 'config', 'AlertsService',
    function directive(users, players, $http, teams, positionsets, leagues, sports, session, ROLE_TYPE, config, alerts) {

        function link(scope) {
            scope.rolesInfo = [];
            scope.options = {
                scope: scope
            };

            scope.save = function(user) {
                if (user.fileImage) {
                    var data = new FormData();
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

            var teamRosters = [];
            var userRoles = session.currentUser.roles;
            var tempPlayers = [];

            userRoles.forEach(function(role, index) {
                scope.team = teams.get(userRoles[index].teamId);
                var teamPlayers = scope.team.roster.playerInfo;
                var league = leagues.get(scope.team.leagueId);
                var positionset = positionsets.get(league.positionSetId);
                var positions = positionset.positions;

                Object.keys(teamPlayers).forEach(function(teamPlayerId) {

                    var playerIds = scope.players.map(function(player) {return player.id;});

                    if (~playerIds.indexOf(Number(teamPlayerId))) {

                        var thisPlayer = players.get(teamPlayerId);

                        if (thisPlayer.userId == session.currentUser.id) {
                            tempPlayers[index] = thisPlayer;
                        }
                    }
                });

                if (tempPlayers[index]) {
                    scope.rolesInfo[index] = {
                        team: scope.team,
                        positions: positions,
                        positionIds: scope.team.roster.playerInfo[tempPlayers[index].id].positionIds,
                        jerseyNumber: scope.team.roster.playerInfo[tempPlayers[index].id].jerseyNumber,
                        sport:  sports.get(league.sportId)
                    };
                }
            });

        }

        var PlayerInformation = {

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


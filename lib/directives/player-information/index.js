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
            scope.roleInfo = {};
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
            var team = teams.get(session.currentUser.currentRole.teamId);
            var league = leagues.get(team.leagueId);
            var positionset = positionsets.get(league.positionSetId);

            scope.positions = positionset.positions;

            for (var index = 0; index < scope.players.length; index++) {
                var tempPlayer = scope.players[index];
                if (~tempPlayer.rosterIds.indexOf(team.roster.id)) {
                    scope.roleInfo = {
                        team: team,
                        positionIds: tempPlayer.positionIds[team.roster.id],
                        jerseyNumber: tempPlayer.jerseyNumbers[team.roster.id],
                        sport:  sports.get(leagues.get(team.leagueId).sportId)
                    };
                }
            }

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


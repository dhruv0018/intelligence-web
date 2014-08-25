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
    'UsersFactory', 'PlayersFactory', '$http', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'SessionService', 'ROLE_TYPE', 'config', 'AlertsService',
    function directive(users, players, $http, teams, leagues, sports, session, ROLE_TYPE, config, alerts) {

        function link(scope) {
            scope.playerInformationSet = [];
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
                            session.storeCurrentUser(responseUser);
                            scope.user.save().then(function() {
                                alerts.add({
                                    type: 'success',
                                    message: 'Your profile has been saved.'
                                });
                            });
                        })
                        .error(function() {
                            console.log('the image upload failed');
                        });
                } else {
                    scope.user.save();
                }
            };

            var teamRosters = [];
            angular.forEach(scope.user.roles, function(role) {
                if (role.type.id === ROLE_TYPE.ATHLETE) {
                    angular.forEach(scope.players, function(player) {
                        var team = teams.get(role.teamId);
                        scope.playerInformationSet.push({
                            team: team,
                            positions: player.positions[team.roster.id],
                            jerseyNumber: player.jerseyNumbers[team.roster.id],
                            sport: sports.get(leagues.get(team.leagueId).sportId)
                        });
                    });
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


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
    'UsersFactory', 'PlayersFactory', '$http', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'SessionService', 'ROLE_TYPE', 'config',
    function directive(users, players, $http, teams, leagues, sports, session, ROLE_TYPE, config) {

        function link(scope) {
            scope.user = users.get(59);
            scope.playerInformationSet = [];
            scope.options = {
                scope: scope
            };

            scope.save = function(user) {
                var data = new FormData();
                console.log(user.imageUrl);
                data.append('imageFile', user.imageUrl);

                $http.post(config.api.uri + 'users/' + user.id + '/image/file', data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(user) {
                    console.log(user);
                    scope.user = user;
                    users.save();
                })
                .error(function() {
                    console.log('the image upload failed');
                });
            };

            players.query({
                userId: scope.user.id
            }).then(function(players) {
                var teamRosters = [];
                angular.forEach(scope.user.roles, function(role) {
                    if (role.type.id === ROLE_TYPE.ATHLETE) {
                        angular.forEach(players, function(player) {
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


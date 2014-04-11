/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/opposing-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Opposing Team page module.
 * @module OpposingTeam
 */
var OpposingTeam = angular.module('Coach.Game.OpposingTeam', []);

/* Cache the template file */
OpposingTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * OpposingTeam directive.
 * @module OpposingTeam
 * @name OpposingTeam
 * @type {directive}
 */
OpposingTeam.directive('krossoverCoachGameOpposingTeam', [
    function directive() {

        var krossoverCoachGameOpposingTeam = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.OpposingTeam.controller',

            scope: {

                game: '=?'
            }
        };

        return krossoverCoachGameOpposingTeam;
    }
]);

/**
 * OpposingTeam controller.
 * @module OpposingTeam
 * @name OpposingTeam
 * @type {controller}
 */
OpposingTeam.controller('Coach.Game.OpposingTeam.controller', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'Coach.Game.Tabs', 'Coach.Game.Data', 'GamesFactory', 'PlayersFactory',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, tabs, data, games, players) {

        $scope.tabs = tabs;
        $scope.data = data;

        data.opposingTeam.players = data.opposingTeam.players || [];

        /*
         * Scope watches.
         */

        $scope.$watch('game', function(game) {

            if (game && game.getRoster && game.opposingTeamId) {

                var roster = game.getRoster(game.opposingTeamId);

                if (roster) {

                    $scope.rosterId = roster.id;
                }
            }
        });

        $scope.$watch('formOpposingTeam.$invalid', function(invalid) {

            tabs.instructions.disabled = invalid;
        });


        $scope.$watch('tabs["opposing-team"].disabled', function(disabled) {

            tabs.instructions.disabled = disabled;
        });

        /*
         * Scope methods.
         */

        $scope.addNewPlayer = function() {

            var player = {

                played: true,
                jerseyNumbers: {}
            };

            data.opposingTeam.players.push(player);
        };

        $scope.removePlayer = function(player) {

            if (player) data.opposingTeam.players.splice(data.opposingTeam.players.indexOf(player), 1);
        };

        $scope.uploadPlayers = function(files) {

            var file = files[0];
            var data = new FormData();

            data.append('rosterId', $scope.rosterId);
            data.append('roster', file);

            $http.post(config.api.uri + 'batch/players/file',

                data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })

                .success(function(data) {

                    data.opposingTeam.players = data.map(function(player) {

                        player.name = player.firstName + ' ' + player.lastName;
                        player.played = true;
                        return player;
                    });
                })

                .error(function() {

                    $rootScope.$broadcast('alert', {

                        type: 'danger',
                        message: 'There was a problem. Please try again.'
                    });
                });
        };

        $scope.save = function() {

            players.save($scope.rosterId, data.opposingTeam.players);
            tabs.activateTab('instructions');
        };
    }
]);


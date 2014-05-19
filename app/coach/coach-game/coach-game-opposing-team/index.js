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
                opposingTeamRoster: '=?',
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
        $scope.data = {};

        data.then(function(coachData) {
            $scope.data = coachData;
            $scope.positions = coachData.positionSet.indexedPositions;

            if (coachData.opposingTeamGameRoster) {
                $scope.data.opposingTeam = {
                    players: coachData.opposingTeamGameRoster.players || []
                };
                $scope.data.opposingTeam.players = players.constructPositionDropdown(coachData.opposingTeamGameRoster.players, coachData.game.rosters[coachData.game.opposingTeamId].id, $scope.positions);
            }
        });

        /*
         * Scope watches.
         */

        $scope.$watch('game', function(game) {
            if(game.rosters){
                $scope.opposingTeamRosterId = game.rosters[game.opposingTeamId].id;
            }
        });

        $scope.$watch('data.opposingTeam.players', function(opposingTeamRoster){
            if (typeof opposingTeamRoster !== 'undefined') {
                if(opposingTeamRoster.length === 0) {
                    $scope.addNewPlayer();
                }
            } else {
                $scope.data.opposingTeam = {
                    players: []
                };
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
                jerseyNumbers: {},
                positions: {},
                selectedPositions: {},
                rosterStatuses: {}
            };
            player.selectedPositions[$scope.opposingTeamRosterId] = [];
            player.rosterStatuses[$scope.opposingTeamRosterId] = true;
            $scope.data.opposingTeam.players.push(player);
        };

        $scope.removePlayer = function(player) {

            if (typeof player.id === 'undefined'){
                $scope.data.opposingTeam.players.splice($scope.data.opposingTeam.players.indexOf(player), 1);
            } else {
                player.rosterStatuses[$scope.opposingTeamRosterId] = false;
            }

        };

        $scope.uploadPlayers = function(files) {

            var file = files[0];
            var data = new FormData();

            data.append('rosterId', $scope.opposingTeamRosterId);
            data.append('roster', file);

            $http.post(config.api.uri + 'batch/players/file',

                data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(uploadedPlayers){
                    if (typeof $scope.data.opposingTeam === 'undefined') {
                        $scope.data.opposingTeam = {
                            players: uploadedPlayers
                        };
                    }
                    $scope.data.opposingTeam.players = players.constructPositionDropdown(success, $scope.opposingTeamRosterId, $scope.positions);
                })
                .error(function() {

                    $rootScope.$broadcast('alert', {

                        type: 'danger',
                        message: 'There was a problem. Please try again.'
                    });
                });
        };

        $scope.save = function() {
            $scope.data.opposingTeam.players = players.getPositionsFromDowndown($scope.data.opposingTeam.players, $scope.opposingTeamRosterId, $scope.positions);
            players.save($scope.game.rosters[$scope.game.opposingTeamId].id, $scope.data.opposingTeam.players);
            tabs.activateTab('instructions');
        };

    }
]);


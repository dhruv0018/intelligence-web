/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/game-info.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game info page module.
 * @module Info
 */
var Info = angular.module('Coach.Game.Info', [
    'ui.bootstrap'
]);

/* Cache the template file */
Info.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Info directive.
 * @module Info
 * @name Info
 * @type {directive}
 */
Info.directive('krossoverCoachGameInfo', [
    function directive() {

        var krossoverCoachGameInfo = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.Info.controller',

            scope: {
                headings: '=',
                $flow: '=?flow',
                data: '=',
                tabs: '='
            }
        };

        return krossoverCoachGameInfo;
    }
]);

/**
 * Info controller.
 * @module Info
 * @name Info.controller
 * @type {controller}
 */
Info.controller('Coach.Game.Info.controller', [
    '$q', '$rootScope', '$scope', '$window', '$state', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'SessionService', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory', 'PlayersFactory',
    function controller($q, $rootScope, $scope, $window, $state, GAME_TYPES, GAME_NOTE_TYPES, session, teams, leagues, games, players) {

        $scope.session = session;

        $scope.todaysDate = Date.now();

        //CONSTANTS
        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        //Factories
        $scope.games = games;

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Game Manipulation
        $scope.data.game.notes = $scope.data.game.notes || {};
        $scope.data.game.notes[GAME_NOTE_TYPES.COACH_NOTE] = $scope.data.game.notes[GAME_NOTE_TYPES.COACH_NOTE] || [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE, content: ''}];

        //Opposing Team Construction
        if ($scope.data.game.id) {
            $scope.tabs.enableAll();

            /* FIXME: Can this be removed? */
            $scope.data.opposingTeam = {
                name:  $scope.teams[$scope.data.game.opposingTeamId].name || ''
            };
        }

        if ($scope.data.game.isRegular()) {
            $scope.data.team = teams.get(session.currentUser.currentRole.teamId);
        }

        //Save functionality
        $scope.save = function() {

            if ($scope.data.game.id) {
                //$q.all($scope.saveExisting()).then($scope.goToRoster);
                $scope.saveExisting();
                $scope.goToRoster();
            } else {
                $q.all($scope.constructNewGame()).then($scope.goToRoster);
            }
        };

        $scope.saveExisting = function() {
            var promises = [];

            /* TODO: Should check if the game info form is dirty to see if save
             * is needed. */

            /* TODO: Might also check if team names have changed before saving
             * teams. */

            //Saves the scouting team
            if (!games.isRegular($scope.data.game)) {
                promises.push($scope.teams[$scope.data.game.teamId].save());
            }

            //Saves the opposing team
            promises.push($scope.teams[$scope.data.game.opposingTeamId].save());

            //Saves the game
            promises.push($scope.data.game.save());

            return promises;
        };

        $scope.constructNewGame = function() {

            var promises = {};

            var game = $scope.data.game;

            if (game.isNonRegular()) {
                promises.scouting = $scope.constructNewTeam('scouting');
            }

            promises.opposing = $scope.constructNewTeam('opposing');

            /* FIXME: Should be this: */
            //return $q.all(promises).then(function(promisedData) {
            return $q.all(promises).then(function(promisedData) {

                if (game.isRegular()) {
                    $scope.data.game.teamId = session.currentUser.currentRole.teamId;
                } else {
                    $scope.data.game.teamId = promisedData.scouting.id;
                }

                //Creating Game Rosters
                $scope.data.game.rosters = {};
                $scope.data.game.rosters[$scope.data.game.teamId] = {};
                $scope.data.game.rosters[promisedData.opposing.id] = {};

                return $scope.data.game.save().then(function(game) {
                    $scope.data.game = game;
                    $scope.data.gamePlayerLists = {};
                    $scope.data.gamePlayerLists[promisedData.opposing.id] = [];
                    $scope.data.gamePlayerLists[$scope.data.game.teamId] = [];
                    return $scope.buildGameRoster(game);
                });
            });
        };

        $scope.buildGameRoster = function(game) {

            var team = teams.get(game.teamId);
            var teamPlayers = $scope.data.playersList;
            var activeTeamPlayers = players.constructActiveRoster(teamPlayers, team.roster.id);

            if ((!$scope.data.gamePlayerLists[game.teamId] || $scope.data.gamePlayerLists[game.teamId].length <= 1) && $scope.data.game.isRegular()) {

                angular.forEach(activeTeamPlayers, function(teamPlayer) {

                    teamPlayer.transferPlayerInformation(team.roster.id, game.rosters[game.teamId].id);
                    $scope.data.gamePlayerLists[game.teamId].push(teamPlayer);
                });
                //TODO not super happy about this or sure if it will work once we start importing real teams and their rosters
                return players.save(game.rosters[game.teamId].id, $scope.data.gamePlayerLists[game.teamId]);
            }
        };

        $scope.constructNewTeam = function(type) {

            if (type === 'opposing') {
                var newOpposingTeam = {
                    isCustomerTeam: false,
                    leagueId: $scope.data.league.id,
                    primaryAwayColor: $scope.isHomeGame ? $scope.data.game.opposingPrimaryColor : null,
                    primaryHomeColor: $scope.isHomeGame ? null : $scope.data.game.opposingPrimaryColor,
                    secondaryAwayColor: $scope.isHomeGame ? $scope.data.game.opposingSecondaryColor : null,
                    secondaryHomeColor: $scope.isHomeGame ? null : $scope.data.game.opposingSecondaryColor
                };
                angular.extend($scope.data.opposingTeam, $scope.data.opposingTeam, newOpposingTeam);
                return teams.save($scope.data.opposingTeam).then(function(opposingTeam) {
                    $scope.data.game.opposingTeamId = opposingTeam.id;
                    return opposingTeam;
                });
            } else if (type === 'scouting') {
                var scoutingTeam = {
                    name: $scope.data.team.name,
                    isCustomerTeam: false,
                    leagueId: $scope.data.league.id,
                    primaryAwayColor: $scope.data.game.primaryJerseyColor,
                    primaryHomeColor: $scope.data.game.primaryJerseyColor,
                    secondaryAwayColor: $scope.data.game.secondaryJerseyColor,
                    secondaryHomeColor: $scope.data.game.secondaryJerseyColor
                };
                angular.extend($scope.data.team, $scope.data.team, scoutingTeam);

                return teams.save($scope.data.team).then(function(scoutingTeam) {
                    $scope.data.game.teamId = scoutingTeam.id;
                    return scoutingTeam;
                });
            }

        };


        $scope.goToRoster = function() {

            $scope.tabs.enableAll();
            $scope.tabs.deactivateAll();
            $scope.formGameInfo.$dirty = false;
            $scope.tabs.team.active = true;
        };

        var prompt = 'Your game will not get uploaded without entering in the game information.';

        /* When changing state. */
        $rootScope.$on('$stateChangeStart', function(event) {

            /* If the game has not been saved and the game information has not been completed .*/
            if (!$scope.data.game.id && $scope.formGameInfo.$invalid) {

                if (confirm(prompt + '\n\nDo you still want to leave?')) {

                    $scope.$flow.cancel();
                }

                else {

                    event.preventDefault();
                    $rootScope.$broadcast('$stateChangeError');
                }
            }
        });

        /* When changing location. */
        $rootScope.$on('$locationChangeStart', function(event) {

            /* If the game has not been saved and the game information has not been completed .*/
            if (!$scope.data.game.id && $scope.formGameInfo.$invalid) {

                if (confirm(prompt + '\n\nDo you still want to leave?')) {

                    $scope.$flow.cancel();
                }

                else {

                    event.preventDefault();
                    $rootScope.$broadcast('$stateChangeError');
                }
            }
        });

        /* Before unloading the page. */
        $window.onbeforeunload = function beforeunloadHandler() {

            /* If the game information has not been completed .*/
            if ($scope.formGameInfo.$invalid) {

                return prompt;
            }
        };
    }
]);


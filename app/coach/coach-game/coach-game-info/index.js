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
                tabs: '=',
                game: '=',
                league: '='
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
    '$q', '$rootScope', '$scope', '$modal', '$window', '$state', 'BasicModals', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'SessionService', 'TeamsFactory', 'LeaguesFactory', 'PlayersFactory', 'GamesFactory',
    function controller($q, $rootScope, $scope, $modal, $window, $state, modals, GAME_TYPES, GAME_NOTE_TYPES, session, teams, leagues, games, players) {

        $scope.session = session;

        $scope.todaysDate = Date.now();

        //CONSTANTS
        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        //Factories
        $scope.games = games;

        //Collections
        $scope.teams = teams.getCollection();

        //Game Manipulation
        $scope.game.notes = $scope.game.notes || {};
        console.log(GAME_NOTE_TYPES);
        //TODO figure out how this works
        //$scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] || [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE, content: ''}];
        //$scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] = ($scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE]) ? $scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] : [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE, content: ''}];
        console.log($scope.game);


        if ($scope.game.id && $scope.game.teamId && $scope.game.opposingTeamId) {
            $scope.tabs.enableAll();
        }

        if ($scope.game.isRegular()) {
            $scope.game.teamId = session.currentUser.currentRole.teamId;
        }

        //Temporary
        $scope.gameTeams = {
            team: ($scope.teams[$scope.game.teamId]) ? $scope.teams[$scope.game.teamId] : {},
            opposingTeam: ($scope.teams[$scope.game.opposingTeamId]) ? $scope.teams[$scope.game.opposingTeamId] : {}
        };

        //Save functionality
        $scope.save = function() {

            var promises = {};

            if (!$scope.gameTeams.team.id) {
                var newTeam = teams.create({isCustomerTeam: false, leagueId: $scope.league.id, name: $scope.gameTeams.team});
                $scope.gameTeams.team = newTeam;
            }

            if (!$scope.gameTeams.opposingTeam.id) {
                var newOpposingTeam = teams.create({isCustomerTeam: false, leagueId: $scope.league.id, name: $scope.gameTeams.opposingTeam});
                $scope.gameTeams.opposingTeam = newOpposingTeam;
            }

            promises = {
                team: $scope.gameTeams.team.save(),
                opposingTeam: $scope.gameTeams.opposingTeam.save()
            };

            $q.all(promises).then(function(response) {
                $scope.game.teamId = response.team.id;
                $scope.game.opposingTeamId = response.opposingTeam.id;
                $scope.game.save().then(function() {
                    //TODO add method to build the game rosters in this section when the backend is done
                    $scope.goToRoster();
                });
            });

        };

        $scope.buildGameRoster = function(game) {

            var team = teams.get(game.teamId);
            var teamPlayers = $scope.data.playersList;
            var activeTeamPlayers = players.constructActiveRoster(teamPlayers, team.roster.id);

            if ((!$scope.gamePlayerLists[game.teamId] || $scope.gamePlayerLists[game.teamId].length <= 1) && $scope.game.isRegular()) {

                angular.forEach(activeTeamPlayers, function(teamPlayer) {

                    teamPlayer.transferPlayerInformation(team.roster.id, game.rosters[game.teamId].id);
                    $scope.gamePlayerLists[game.teamId].push(teamPlayer);
                });
                //TODO not super happy about this or sure if it will work once we start importing real teams and their rosters
                return players.save(game.rosters[game.teamId].id, $scope.gamePlayerLists[game.teamId]);
            }
        };

        $scope.goToRoster = function() {

            $scope.tabs.enableAll();
            $scope.tabs.deactivateAll();
            $scope.formGameInfo.$dirty = false;
            $scope.tabs.team.active = true;
        };

        //Confirmation for deleting a game
        $scope.deleteGame = function() {

            var deleteGameModal = modals.openForConfirm({
                title: 'Delete Game',
                bodyText: 'Deleteing this game will delete all the information associated with it.',
                buttonText: 'Yes, I understand'
            });

            deleteGameModal.result.then(function() {
                $scope.game.isDeleted = true;

                $scope.game.save();
                $state.go('Coach.FilmHome');
            });

        };
    }
]);


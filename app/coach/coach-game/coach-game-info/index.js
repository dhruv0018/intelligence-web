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

        //prevents put request cascade
        $scope.game.allowEdits = ($scope.game.opposingTeamId && $scope.game.teamId && $scope.game.rosters[$scope.game.teamId].id) ? true : false;

        //TODO figure out how this works
        //$scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] || [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE, content: ''}];
        //$scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] = ($scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE]) ? $scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] : [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE, content: ''}];


        if ($scope.game.id && $scope.game.teamId && $scope.game.opposingTeamId) {
            $scope.tabs.enableAll();
        }

        if ($scope.game.isRegular()) {
            $scope.game.teamId = session.currentUser.currentRole.teamId;
        }

        //Temporary
        $scope.gameTeams = {
            team: ($scope.teams[$scope.game.teamId]) ? $scope.teams[$scope.game.teamId] : teams.create({isCustomerTeam: false, leagueId: $scope.league.id}),
            opposingTeam: ($scope.teams[$scope.game.opposingTeamId]) ? $scope.teams[$scope.game.opposingTeamId] : teams.create({isCustomerTeam: false, leagueId: $scope.league.id})
        };

        //Save functionality
        $scope.save = function() {

            var promises = {};

            if (!$scope.game.teamId || $scope.gameTeams.team.name !== $scope.teams[$scope.game.teamId].name) {
                promises.team = $scope.gameTeams.team.save();
            }

            if (!$scope.game.opposingTeamId ||$scope.gameTeams.opposingTeam.name !== $scope.teams[$scope.game.opposingTeamId].name) {
                promises.opposingTeam = $scope.gameTeams.opposingTeam.save();
            }

            $q.all(promises).then(function(response) {
                $scope.game.teamId = (response.team) ? response.team.id : $scope.gameTeams.team.id;
                $scope.game.opposingTeamId = (response.opposingTeam) ? response.opposingTeam.id : $scope.gameTeams.opposingTeam.id;

                var team = teams.get($scope.game.teamId);
                var opposingTeam = teams.get($scope.game.opposingTeamId);

                $scope.game.rosters = ($scope.game.rosters && $scope.game.rosters[$scope.game.teamId]) ? $scope.game.rosters : {};

                if (!$scope.game.rosters[$scope.game.teamId]) {
                    //filtering out the players from your team roster who are inactive
                    var filteredPlayerInfo = {};
                    angular.forEach(team.roster.playerInfo, function(playerInfo, playerId) {
                        if (playerInfo.isActive) {
                            filteredPlayerInfo[playerId] = playerInfo;
                        }
                    });

                    $scope.game.rosters[$scope.game.teamId] = {
                        teamId: $scope.game.teamId,
                        playerInfo: filteredPlayerInfo
                    };


                    $scope.game.rosters[$scope.game.opposingTeamId] = {
                        teamId: $scope.game.opposingTeamId,
                        playerInfo: opposingTeam.roster.playerInfo
                    };
                }

                $scope.game.save().then(function() {
                    $scope.goToRoster();
                });

            });

        };

        $scope.goToRoster = function() {

            $scope.tabs.enableAll();
            $scope.tabs.deactivateAll();
            $scope.formGameInfo.$dirty = false;
            $scope.tabs.team.active = true;
            $scope.game.allowEdits = true; //prevents put request cascade
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


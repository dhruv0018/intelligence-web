/* Component settings */
var templateUrl = 'coach/uploading-film/game-info.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game info page module.
 * @module GameInfo
 */
var GameInfo = angular.module('game-info', []);

/* Cache the template file */
GameInfo.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Game Info page state router.
 * @module GameInfo
 * @type {UI-Router}
 */
GameInfo.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('game-info', {
                url: '',
                parent: 'uploading-film',
                views: {
                    'game-info@uploading-film': {
                        templateUrl: templateUrl,
                        controller: 'GameInfoController'
                    }
                }
            });
    }
]);

/**
 * GameInfo controller.
 * @module GameInfo
 * @name GameInfoController
 * @type {Controller}
 */
GameInfo.controller('GameInfoController', [
    '$scope', '$state', '$localStorage', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'UploadingFilmTabs', 'SessionService', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory',
    function controller($scope, $state, $localStorage, GAME_TYPES, GAME_NOTE_TYPES, tabs, session, teams, leagues, games) {

        $scope.GAME_TYPES = GAME_TYPES;

        $scope.$storage = $localStorage;

        $scope.$storage.game.notes = $scope.$storage.game.notes || [];
        $scope.$storage.game.notes.unshift({
            noteTypeId: GAME_NOTE_TYPES.COACH_NOTE,
            content: games.findNoteContentByType($scope.$storage.game.notes, 1)
        });

        var teamId = session.currentUser.currentRole.teamId;

        teams.get(teamId, function(team) {
            $scope.$storage.team = team;
            $scope.$storage.opposingTeam.leagueId = team.leagueId;
            $scope.$storage.game.teamId = team.id;
            $scope.$storage.game.primaryJerseyColor = team.primaryJerseyColor;
            $scope.$storage.game.secondaryJerseyColor = team.secondaryJerseyColor;
        });

        /* Setup opposing team. */
        $scope.$storage.opposingTeam = $scope.$storage.opposingTeam || {};

        $scope.$watch('formGameInfo.$invalid', function(invalid) {

            tabs['your-team'].disabled = invalid;
        });

        $scope.save = function() {

            var isHomeGame = $scope.$storage.game.isHomeGame == 'true';
            $scope.$storage.opposingTeam.isCustomerTeam = false;
            $scope.$storage.opposingTeam.primaryAwayColor = isHomeGame ? $scope.$storage.game.opposingPrimaryColor : null;
            $scope.$storage.opposingTeam.primaryHomeColor = isHomeGame ? null : $scope.$storage.game.opposingPrimaryColor;
            $scope.$storage.opposingTeam.secondaryAwayColor = isHomeGame ? $scope.$storage.game.opposingSecondaryColor : null;
            $scope.$storage.opposingTeam.secondaryHomeColor = isHomeGame ? null : $scope.$storage.game.opposingSecondaryColor;

            teams.save($scope.$storage.opposingTeam).then(function(team) {

                $scope.$storage.opposingTeam = team;
                $scope.$storage.game.opposingTeamId = team.id;
                $scope.$storage.game.rosters = {};
                $scope.$storage.game.rosters[$scope.$storage.game.teamId] = {};
                $scope.$storage.game.rosters[$scope.$storage.game.opposingTeamId] = {};

                games.save($scope.$storage.game).then(function(game) {

                    $scope.$storage.game = game;
                    tabs['game-info'].active = false;
                    tabs['your-team'].active = true;

                    if (!$state.params.id) {
                        $state.go('your-team');
                    }

                });
            });
        };
    }
]);


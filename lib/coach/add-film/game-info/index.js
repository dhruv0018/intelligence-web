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
    '$scope', '$state', '$localStorage', 'UploadingFilmTabs', 'SessionService', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory',
    function controller($scope, $state, $localStorage, tabs, session, teams, leagues, games) {

        /* FIXME: Just temp until we have season data. */
        $scope.seasons = [

            { name: 'Fall 2010' },
            { name: 'Winter 2011' },
            { name: 'Spring 2011' },
            { name: 'Summer 2011' },
            { name: 'Fall 2012' },
            { name: 'Summer 2012' },
            { name: 'Fall 2013' },
            { name: 'Summer 2013' },
            { name: 'Winter 2014' }
        ];

        $scope.GAME_TYPES = [

            { name: 'Conference Game', value: 'conference', checked: true },
            { name: 'Non-Conference Game', value: 'nonconfernece', checked: false },
            { name: 'Playoff Game', value: 'playoff', checked: false },
        ];

        $scope.$storage = $localStorage;

        var teamId = session.currentUser.currentRole.teamId;

        teams.get(teamId, function(team) {

            $scope.$storage.team = team;
            $scope.$storage.game.teamId = team.id;
            $scope.$storage.game.primaryJerseyColor = team.primaryJerseyColor;
            $scope.$storage.game.secondaryJerseyColor = team.secondaryJerseyColor;
        });

        $scope.$watch('formGameInfo.$invalid', function(invalid) {

            tabs['your-team'].disabled = invalid;
        });

        $scope.save = function() {

            var name = $scope.opposingTeamName;
            var leagueId =  $scope.$storage.team.leagueId;
            var isHomeGame = $scope.$storage.game.isHomeGame == 'true';
            var primaryAwayColor = isHomeGame ? $scope.$storage.game.opposingPrimaryColor : null;
            var primaryHomeColor = isHomeGame ? null : $scope.$storage.game.opposingPrimaryColor;
            var secondaryAwayColor = isHomeGame ? $scope.$storage.game.opposingSecondaryColor : null;
            var secondaryHomeColor = isHomeGame ? null : $scope.$storage.game.opposingSecondaryColor;

            var opposingTeam = {

                isCustomerTeam: false,
                name: name,
                leagueId: leagueId,
                primaryAwayColor: primaryAwayColor,
                primaryHomeColor: primaryHomeColor,
                secondaryAwayColor: secondaryAwayColor,
                secondaryHomeColor: secondaryHomeColor
            };

            teams.save(opposingTeam).then(function(team) {

                $scope.$storage.game.opposingTeamId = team.id;
                $scope.$storage.game.rosters = [

                    { teamId: $scope.$storage.game.teamId },
                    { teamId: $scope.$storage.game.opposingTeamId }
                ];

                games.save($scope.$storage.game).then(function(game) {

                    $scope.$storage.game = game;
                    tabs['game-info'].active = false;
                    tabs['your-team'].active = true;
                    $state.go('your-team');
                });
            });
        };
    }
]);


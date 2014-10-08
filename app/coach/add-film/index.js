/* File dependencies. */

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Film page module.
 * @module AddFilm
 */
var AddFilm = angular.module('add-film', [
    'ui.router',
    'ui.bootstrap',
    'plan'
]);

/* Cache the template file */
AddFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/add-film/template.html', require('./template.html'));
        $templateCache.put('coach/add-film/start.html', require('./start.html'));
    }
]);

/**
 * Add Film page state router.
 * @module AddFilm
 * @type {UI-Router}
 */
AddFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var addFilm = {
            name: 'add-film',
            url: '/add-film',
            parent: 'Coach',
            views: {
                'main@root': {
                    templateUrl: 'coach/add-film/template.html',
                    controller: 'AddFilmController'
                },
                'content@add-film': {
                    templateUrl: 'coach/add-film/start.html',
                    controller: 'StartController'
                }
            },
            resolve: {
                'Coach.Data': [
                    '$q', 'Coach.Data.Dependencies', 'SessionService', 'LeaguesFactory', 'TeamsFactory',
                    function($q, data, session, leagues, teams) {

                        data.remainingBreakdowns = teams.getRemainingBreakdowns(session.currentUser.currentRole.teamId);

                        return $q.all(data).then(function(data) {
                            var leaguesCollection = leagues.getCollection();
                            var teamsCollection = teams.getCollection();
                            var team = teamsCollection[session.currentUser.currentRole.teamId];
                            data.league = leaguesCollection[team.leagueId];
                            data.coachsTeam = team;

                            return data;
                        });
                    }
                ]
            }
        };

        $stateProvider.state(addFilm);
    }
]);

/**
 * AddFilm controller.
 * @module AddFilm
 * @name AddFilmController
 * @type {Controller}
 */
AddFilm.controller('AddFilmController', [
    '$scope', '$state', 'config', 'GamesFactory', 'Coach.Data', 'AlertsService',
    function controller($scope, $state, config, games, data, alerts) {
        $scope.games = games;
        $scope.data = data;
        data.game = games.create();
        $scope.howToUpload = config.links.addFilmHelp.howToUpload.uri;
        $scope.commonIssues = config.links.addFilmHelp.commonIssues.uri;
        $scope.moreQuestions = config.links.addFilmHelp.moreQuestions.uri;

        //Show message with link to support page if no games uploaded
        if (!games.getList().length) {
            alerts.add({
                type: 'info',
                message: '<i class="icon icon-warning"></i> New to the upload process? It’s easy. <a target="_blank" href="' + $scope.howToUpload + '">Let us show you how.</a>'
            });
        }
    }
]);

AddFilm.controller('StartController', [
    '$scope', 'GAME_TYPES', 'Coach.Data', 'SessionService', 'LeaguesFactory', 'TeamsFactory', 'kvsUploaderInterface.Modal',
    function($scope, GAME_TYPES, data, session, leagues, teams) {
        //intialize as -1 to remove flase negative. 0 means no team roster, 1 means valid team roster
        $scope.hasRoster = -1;

        $scope.options = {
            scope: $scope
        };

        $scope.setGameType = function(gameType) {
            data.game.gameType = gameType;
            $scope.options.film = data.game;
        };

        //check if team has a valid roster
        var team = teams.get(session.currentUser.currentRole.teamId);
        if (data.playersList && data.playersList.some(function(player) { return !player.isUnknown && player.rosterStatuses[team.roster.id]; })) {
            $scope.hasRoster = 1;
        } else {
            $scope.hasRoster = 0;
        }

        $scope.GAME_TYPES = GAME_TYPES;

        $scope.league = leagues.getCollection()[data.coachsTeam.leagueId];
        $scope.activePlan = data.coachsTeam.getActivePlan() || {};
        $scope.activePackage = data.coachsTeam.getActivePackage() || {};

        $scope.remainingBreakdowns = data.remainingBreakdowns;


    }
]);

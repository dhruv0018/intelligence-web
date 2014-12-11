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
                }
            },
            resolve: {
                'Coach.Data': [
                    '$q', 'Coach.Data.Dependencies', 'SessionService', 'LeaguesFactory', 'TeamsFactory',
                    function($q, data, session, leagues, teams) {

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
    '$scope', '$state', 'config', 'GamesFactory', 'Coach.Data', 'AlertsService', 'TeamsFactory', 'SessionService', 'GAME_TYPES', 'LeaguesFactory', 'kvsUploaderInterface.Modal',
    function controller($scope, $state, config, games, data, alerts, teams, session, GAME_TYPES, leagues, uploaderModal) {

        //constants
        $scope.GAME_TYPES = GAME_TYPES;

        //TODO we should find a way to not attach factories to the scope of controllers, aka, we need to find a way to access helper methods from templates in a more correct way
        //bounded factories
        $scope.games = games;

        //resources
        $scope.game = games.create();
        $scope.team = teams.get(session.currentUser.currentRole.teamId);
        $scope.league = leagues.getCollection()[$scope.team.leagueId];

        //Links for instructions ui
        $scope.howToUpload = config.links.addFilmHelp.howToUpload.uri;
        $scope.commonIssues = config.links.addFilmHelp.commonIssues.uri;
        $scope.moreQuestions = config.links.addFilmHelp.moreQuestions.uri;

        //TODO related to plans and packages ui
        $scope.activePlan = $scope.team.getActivePlan() || {};
        $scope.activePackage = $scope.team.getActivePackage() || {};
        $scope.remainingBreakdowns = session.currentUser.remainingBreakdowns;


        //Used for the uploader modal
        //TODO This pattern is so common that we should find a way to roll it into a method available to modals
        $scope.options = {
            scope: $scope,
            film: $scope.game
        };

        //determines whether or not to restrict uploading a regular game until coach has a roster
        $scope.hasRoster = $scope.team.hasActivePlayerInfo();

        //Show message with link to support page if no games uploaded
        if (!games.getList().length) {
            alerts.add({
                type: 'info',
                message: '<i class="icon icon-warning"></i> New to the upload process? It’s easy. <a target="_blank" href="' + $scope.howToUpload + '">Let us show you how.</a>'
            });
        }

        //wrapper method for upload launching
        $scope.launchUploaderInterface = function(gameTypeId) {
            $scope.game.gameType = gameTypeId;

            if ($scope.game.isNonRegular() || $scope.game.isRegular() && $scope.hasRoster) {
                uploaderModal.open($scope.options);
            }
        };

    }
]);

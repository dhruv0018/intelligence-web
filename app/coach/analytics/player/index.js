/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Analytics page module.
 * @module Analytics
 */
var PlayerAnalytics = angular.module('Coach.Analytics.Player', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template files */
PlayerAnalytics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/analytics/player/template.html', require('./template.html'));
    }
]);

/**
 * Player Analytics page state router.
 * @module Analytics
 * @type {UI-Router}
 */
PlayerAnalytics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Coach.Analytics.Player', {
            url: '/player',
            views: {
                'main@root': {
                    templateUrl: 'coach/analytics/player/template.html',
                    controller: 'PlayerAnalyticsController'
                }
            },
            resolve: {
                'Coach.Data': ['$q', 'Coach.Data.Dependencies', function($q, data) {
                    return $q.all(data);
                }]
            }
        });
    }
]);

/**
 * Player Analytics page controller
 */

PlayerAnalytics.controller('PlayerAnalyticsController', [
    '$scope', '$state', '$stateParams', 'SessionService', 'LeaguesFactory', 'TeamsFactory', 'GAME_TYPES',
    function controller($scope, $state, $stateParams, session, leagues, teams, GAME_TYPES) {
        var teamId = session.currentUser.currentRole.teamId;
        var team = teams.get(teamId);
        var league = leagues.get(team.leagueId);
        $scope.seasons = league.seasons;
        $scope.loadingTables = true;
        $scope.statsData = {};

        //Game type constants
        $scope.CONFERENCE = GAME_TYPES.CONFERENCE;
        $scope.NON_CONFERENCE = GAME_TYPES.NON_CONFERENCE;
        $scope.PLAYOFF = GAME_TYPES.PLAYOFF;

        $scope.filterQuery = {
            seasonId: league.seasons[0].id,
            gameType: ''
        };

        team.generateStats($scope.filterQuery).then(function(statsData) {
            $scope.statsData = statsData;
            $scope.loadingTables = false;
        });

        $scope.generateStats = function() {
            $scope.loadingTables = true;
            team.generateStats($scope.filterQuery).then(function(statsData) {
                $scope.statsData = statsData;
                $scope.loadingTables = false;
            });
        };
    }
]);

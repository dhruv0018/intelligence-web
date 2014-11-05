/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Analytics page module.
 * @module Analytics
 */
var Analytics = angular.module('Coach.Analytics', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template files */
Analytics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/analytics/template.html', require('./template.html'));
    }
]);

/**
 * Analytics page state router.
 * @module Analytics
 * @type {UI-Router}
 */
Analytics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Coach.Analytics', {
            url: '/analytics',
            views: {
                'main@root': {
                    templateUrl: 'coach/analytics/template.html',
                    controller: 'AnalyticsController'
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
 * Analytics page controller
 */

Analytics.controller('AnalyticsController', [
    '$scope', '$state', '$stateParams', 'SessionService', 'LeaguesFactory', 'TeamsFactory',
    function controller($scope, $state, $stateParams, session, leagues, teams) {
        var teamId = session.currentUser.currentRole.teamId;
        var team = teams.get(teamId);
        var league = leagues.get(team.leagueId);
        $scope.seasons = league.seasons;
        $scope.loadingTables = true;
        $scope.data = {};

        $scope.filterQuery = {
            seasonId: league.seasons[0].id,
            gameType: ''
        };

        team.generateStats($scope.filterQuery).then(function(data) {
            $scope.data = data;
            $scope.loadingTables = false;
        });

        $scope.generateStats = function() {
            $scope.loadingTables = true;
            team.generateStats($scope.filterQuery).then(function(data) {
                $scope.data = data;
                $scope.loadingTables = false;
            });
        };
    }
]);


/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Leagues page module.
 * @module Leagues
 */
var Leagues = angular.module('leagues', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template file */
Leagues.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('league.html', require('./league.html'));
        $templateCache.put('leagues.html', require('./leagues.html'));
        $templateCache.put('league-info.html', require('./league-info.html'));
    }
]);

/**
 * Leagues page state router.
 * @module Leagues
 * @type {UI-Router}
 */
Leagues.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('leagues', {
                url: '/leagues',
                parent: 'base',
                views: {
                    'main@root': {
                        templateUrl: 'leagues.html',
                        controller: 'LeaguesController'
                    }
                }
            })

            .state('league', {
                url: '/league/:id',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'league.html',
                        controller: 'LeagueController'
                    }
                }
            })

            .state('league-info', {
                url: '',
                parent: 'league',
                views: {
                    'content@league': {
                        templateUrl: 'league-info.html',
                        controller: 'LeagueController'
                    }
                }
            });
    }
]);

/**
 * League controller. Controls the view for adding and editing a single league.
 * @module League
 * @name LeagueController
 * @type {Controller}
 */
Leagues.controller('LeagueController', [
    '$rootScope', '$scope', '$state', '$stateParams', 'LeaguesFactory', 'TeamsResource', 'SportsFactory',
    function controller($rootScope, $scope, $state, $stateParams, leagues, teams, sports) {
        if ($stateParams.id) {
            leagues.get($stateParams.id, function(league){
                $scope.league = league;
            });
        }
        
        $scope.sports = sports.getList();
        $scope.genders = ['male', 'female', 'coed'];
        
        $scope.save = function(league) {
            
            leagues.save(league);

            $state.go('leagues');
        };

        $scope.cancel = function() {

            $state.go('leagues');
        };
    }
]);

/**
 * Leagues controller. Controls the view for displaying multiple leagues.
 * @module Leagues
 * @name LeaguesController
 * @type {Controller}
 */
Leagues.controller('LeaguesController', [
    '$rootScope', '$scope', '$state', 'LeaguesFactory', 'SportsFactory',
    function controller($rootScope, $scope, $state, leagues, sports) {

        $scope.leagues = leagues.getList();
        $scope.sports = sports.getList();
        $scope.genders = [
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
            {label: 'Co-Ed', value: 'coed'}
        ];
        
        $scope.search = function(filter) {
            leagues.getList(filter,
                    function(leagues){
                        $scope.leagues = leagues;
                        $scope.noResults = false;
                    },
                    function(){
                        $scope.leagues = [];
                        $scope.noResults = true;
                    }
            );
        };
    }
]);


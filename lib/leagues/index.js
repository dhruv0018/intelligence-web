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
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', 'LeaguesFactory', 'TeamsResource', 'SportsFactory', 'TagsetsFactory', 'PositionsetsFactory',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, leagues, teams, sports, tagsets, positionsets) {

        $scope.$storage = $localStorage;

        var league = $scope.$storage.league;
        var leagueId = $stateParams.id;

        if (!league || leagueId !== league.id) {

            leagues.get(leagueId, function(league){

                $scope.$storage.league = league;
            });
        }

        $scope.indexedSports = {};
        $scope.sports = sports.getList({}, function(sports){
            sports.forEach(function(sport){
                $scope.indexedSports[sport.id] = sport;
            });
            return sports;
        });
        
        $scope.tagsets = tagsets.getList();
        
        $scope.positionsets = positionsets.getList();
        
        $scope.genders = ['male', 'female', 'coed'];

        $scope.save = function(league) {
            
            leagues.save(league).then(function() {
                delete $scope.$storage.league;
                $state.go('leagues');
            });
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
    '$rootScope', '$scope', '$state', '$localStorage', 'LeaguesFactory', 'SportsFactory',
    function controller($rootScope, $scope, $state, $localStorage, leagues, sports) {

        $scope.leagues = leagues.getList();
        $scope.sports = sports.getList();
        $scope.genders = [
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
            {label: 'Co-Ed', value: 'coed'}
        ];

        $scope.add = function() {

            delete $localStorage.league;
            $state.go('league-info');
        };

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


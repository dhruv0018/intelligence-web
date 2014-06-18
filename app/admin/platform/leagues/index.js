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
                },
                resolve: {
                    'Leagues.Data': [
                        '$q', 'Platform.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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
                },
                resolve: {
                    'Leagues.Data': [
                        '$q', 'Platform.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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

Leagues.service('Leagues.Data.Dependencies', [
    'LeaguesFactory', 'SportsFactory', 'TagsetsFactory', 'PositionsetsFactory',
    function dataService(leagues, sports, tagsets, positionsets) {

        var Data = {};

        angular.forEach(arguments, function(arg) {
            Data[arg.description] = arg.load();
        });

        return Data;

    }
]);

/**
 * League controller. Controls the view for adding and editing a single league.
 * @module League
 * @name LeagueController
 * @type {Controller}
 */
Leagues.controller('LeagueController', [
    '$scope', '$state', '$stateParams', /*'LeaguesFactory', 'TeamsResource', 'SportsFactory', 'TagsetsFactory', 'PositionsetsFactory',*/ 'Leagues.Data',
    function controller($scope, $state, $stateParams, data) {

        //var league = $scope.$storage.league;
        var leagueId = $stateParams.id;

        $scope.league = data.leagues.get(leagueId);

        /*if (!league || leagueId !== league.id) {

            leagues.get(leagueId, function(league) {

                $scope.$storage.league = league;
            });
        }*/

        $scope.sports = data.sports.getList();
        $scope.indexedSports = data.sports.getCollection();

        /*$scope.indexedSports = {};
        $scope.sports = sports.getList({}, function(sports) {
            sports.forEach(function(sport) {
                $scope.indexedSports[sport.id] = sport;
            });
            return sports;
        });*/

        $scope.tagsets = data.tagsets.getList();

        $scope.positionsets = data.positionsets.getList();

        $scope.genders = ['male', 'female', 'coed'];

        $scope.save = function(league) {

            leagues.save(league).then(function() {
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
    '$scope', '$state', 'LeaguesFactory', 'SportsFactory', 'LeaguesStorage', 'SportsStorage', 'Leagues.Data',
    function controller($scope, $state, leaguesFactory, sportsFactory, leagues, sports, data) {

        $scope.leagues = data.leagues.getList();
        $scope.sports = data.sports.getList();

        $scope.genders = [
            {label: 'male', value: 'male'},
            {label: 'female', value: 'female'},
            {label: 'coed', value: 'coed'}
        ];

        $scope.add = function() {
            $state.go('league-info');
        };

        $scope.search = function(filter) {
            data.leagues.getList(filter,
                    function(leagues) {
                        $scope.leagues = leagues;
                        $scope.noResults = false;
                    },
                    function() {
                        $scope.leagues = [];
                        $scope.noResults = true;
                    }
            );
        };
    }
]);


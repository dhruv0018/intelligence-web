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
                        '$q', 'Leagues.Data.Dependencies',
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
                        '$q', 'Leagues.Data.Dependencies',
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
                        templateUrl: 'league-info.html'
                    }
                }
            });
    }
]);

Leagues.service('Leagues.Data.Dependencies', [
    'LeaguesFactory', 'SportsFactory', 'TagsetsFactory', 'PositionsetsFactory', 'FiltersetsFactory',
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
    '$scope', '$state', '$stateParams', 'SportsFactory', 'LeaguesFactory', 'TagsetsFactory', 'PositionsetsFactory', 'FiltersetsFactory', 'Leagues.Data',
    function controller($scope, $state, $stateParams, sports, leagues, tagsets, positionsets, filtersets, data) {

        var leagueId = $stateParams.id;

        if (!leagueId) leagues.create();

        $scope.league = leagues.get(leagueId);
        $scope.sports = sports.getList();
        $scope.indexedSports = sports.getCollection();
        $scope.tagsets = tagsets.getList();
        $scope.positionsets = positionsets.getList();
        $scope.filtersets = filtersets.getList();

        $scope.genders = ['male', 'female', 'coed'];

        $scope.save = function(league) {

            data.leagues.save(league).then(function() {
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
    '$scope', '$state', 'SportsFactory', 'LeaguesFactory', 'Leagues.Data',
    function controller($scope, $state, sports, leagues, data) {

        $scope.leagues = leagues.getList();
        $scope.sports = sports.getList();

        $scope.genders = [
            {label: 'male', value: 'male'},
            {label: 'female', value: 'female'},
            {label: 'coed', value: 'coed'}
        ];

        $scope.add = function() {
            $state.go('league-info');
        };

        $scope.search = function(filter) {

            $scope.leagues.length = 0;

            $scope.query = data.leagues.query(filter).then(function(leagues) {

                $scope.leagues = leagues;
            });
        };
    }
]);


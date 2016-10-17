const angular = window.angular;

/**
 * Leagues page module.
 * @module Leagues
 */
const Leagues = angular.module('leagues', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

Leagues.service('League.Data.Dependencies', [
    'LeaguesFactory', 'SportsFactory', 'TagsetsFactory', 'FiltersetsFactory', 'PositionsetsFactory',
    function service(leagues, sports, tagsets, filtersets, positionsets) {

        const Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            tagsets: tagsets.load(),
            filtersets: filtersets.load(),
            positionsets: positionsets.load()
        };

        return Data;

    }
]);

Leagues.service('Leagues.Data.Dependencies', [
    'LeaguesFactory', 'SportsFactory', 'TagsetsFactory', 'PositionsetsFactory', 'FiltersetsFactory',
    function service(leagues, sports, tagsets, positionsets) {

        const Data = {

            sports: sports.load(),
            leauges: leagues.load()
        };

        return Data;
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
                        templateUrl: 'app/admin/platform/leagues/leagues.html',
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
                        templateUrl: 'app/admin/platform/leagues/league/league.html',
                        controller: 'LeagueController'
                    }
                },
                resolve: {
                    'League.Data': [
                        '$q', 'League.Data.Dependencies',
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
                        templateUrl: 'app/admin/platform/leagues/league/league-info.html'
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
    '$scope', '$state', '$stateParams', 'SportsFactory', 'LeaguesFactory', 'TagsetsFactory', 'PositionsetsFactory', 'FiltersetsFactory', 'ARENA_TYPES',
    function controller($scope, $state, $stateParams, sports, leagues, tagsets, positionsets, filtersets, ARENA_TYPES) {

        var leagueId = $stateParams.id;

        $scope.sports = sports.getList();
        $scope.indexedSports = sports.getCollection();
        $scope.tagsets = tagsets.getList();
        $scope.positionsets = positionsets.getList();
        $scope.filtersets = filtersets.getList();
        $scope.league = leagueId ? leagues.get(leagueId) : leagues.create();
        $scope.arenas = ARENA_TYPES;
        $scope.arenaIds = Object.keys($scope.arenas);

        $scope.genders = ['male', 'female', 'coed'];

        $scope.save = function() {

            $scope.league.save();

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
    '$scope', '$state', 'SportsFactory', 'LeaguesFactory',
    function controller($scope, $state, sports, leagues) {

        $scope.sports = sports.getCollection();
        $scope.sportsList = sports.getList();
        $scope.leagues = leagues.getList();

        $scope.genders = [
            {label: 'male', value: 'male'},
            {label: 'female', value: 'female'},
            {label: 'coed', value: 'coed'}
        ];


        $scope.search = function(filter) {

            $scope.leagues.length = 0;

            $scope.query = leagues.query(filter).then(function(leagues) {

                $scope.leagues = leagues;
            });
        };
    }
]);

export default Leagues;

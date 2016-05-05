/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film Exchange page module.
 * @module Film Exchange
 */
var FilmExchange = angular.module('filmExchange', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template file */
FilmExchange.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('film-exchange.html', require('./film-exchange.html'));
    }
]);

/**
 * Film Exchange page state router.
 * @module Film Exchange
 * @type {UI-Router}
 */
FilmExchange.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('film-exchange', {
            url: '/film-exchange/:id?page',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'film-exchange.html',
                    controller: 'FilmExchangeController'
                }
            },
            resolve:{
                'Exchange.Data':[
                    'FilmExchangeFactory','$stateParams',
                    function(filmExchange, $stateParams){
                        let exchangeId = $stateParams.id;
                        let page = $stateParams.page||0;
                        return filmExchange.getGames({id: exchangeId, page: page});
                    }
                ]
            }
        });
    }
]);


/**
 * Film Exchange controller.
 * @module filmExchange
 * @name FilmExchangeController
 * @type {Controller}
 */
FilmExchange.controller('FilmExchangeController', [
    '$rootScope', '$scope', '$state', 'FilmExchangeTeams.Modal', 'ROLES', 'FilmExchangeFactory', '$stateParams',
    function controller($rootScope, $scope, $state, FilmExchangeTeamsModal, ROLES, filmExchange, $stateParams) {
        $scope.COACH = ROLES.COACH;
        $scope.currentPage = $stateParams.page||1;

        $scope.pageChanged = function(){
            $state.go('film-exchange', {page: $scope.currentPage}, {location: true, notify: false});
        };

        $scope.openFilmExchangeModal = function() {
            FilmExchangeTeamsModal.open($stateParams.id);
        };

        $scope.search = function(filter){
            console.log(filter);
        };

        $scope.todaysDate = Date.now();

        $scope.teamCompetitionLevels = [
            {id: 1, competitionLevel: 'D1', name: 'D1 level'},
            {id: 2, competitionLevel: 'D2', name: 'D2 level'}
        ];

        //TODO: will be replaced with real data
        $scope.filmExchanges = [
            {
                'id': 22353,
                'datePlayed': '2012-12-28T08:00:00+00:00',
                'homeTeam': {
                    'id': 20777,
                    'name': 'Arizona Wildcats',
                    'primaryConference': {
                        'sportsAssociation': 'US-NCAA',
                        'Code': 'B1G',
                        'competitionLevel': 'D1'
                    },
                    'score': 77,
                    'won': true
                },
                'awayTeam': {
                    'id': 20778,
                    'name': 'Virginia Cavaliers',
                    'primaryConference': {
                        'sportsAssociation': 'US-NCAA',
                        'Code': 'B1G',
                        'competitionLevel': 'D1'
                    },
                    'score': 23
                },
                'addedByUser': {
                    'id': 16090,
                    'firstName': 'Devin',
                    'lastName': 'Yunis',
                    'email': 'devinyunis@icloud.com'
                },
                'addedByTeam': {
                    'id': 20777,
                    'name': 'NYU',
                },
                'createdAt': '2012-12-28T08:00:00+00:00',
                'updatedAt': '2012-12-30T08:00:00+00:00'
            }
        ];
    }
]);

/* Fetch angular from the browser scope */
var angular = window.angular;
const ITEMSPERPAGE = 25;

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
                        return filmExchange.getFilms({id: exchangeId});
                    }
                ],
                'CompetitionLevels.Data':[
                    'FilmExchangeFactory', '$stateParams',
                    function(filmExchange, $stateParams){
                        let exchangeId = $stateParams.id;
                        return filmExchange.getCompetitionLevel({id: exchangeId});
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
    '$rootScope', '$scope', '$state', 'FilmExchangeTeams.Modal', 'ROLES', 'FilmExchangeFactory', '$stateParams', '$filter','SportsFactory', 'CompetitionLevels.Data', 'Exchange.Data',
    function controller($rootScope, $scope, $state, FilmExchangeTeamsModal, ROLES, filmExchange, $stateParams, $filter, sports, CompetitionLevels, exchanges) {
        $scope.COACH = ROLES.COACH;
        $scope.currentPage = $stateParams.page||1;
        $scope.conferenceTitle = $stateParams.id.split('+');
        $scope.conferenceTitle[3] = sports.getMap()[$scope.conferenceTitle[3]];
        $scope.filter= {};
        $scope.itemPerPage = ITEMSPERPAGE;

        $scope.teamCompetitionLevels = CompetitionLevels;
        $scope.filmExchangesTotal = exchanges;
        $scope.todaysDate = Date.now();

        if($stateParams.page){
            $scope.filmExchanges = sliceData($stateParams.page);
        }else{
            $scope.filmExchanges = $scope.filmExchangesTotal.slice(0, ITEMSPERPAGE);
        }

        function sliceData(page){
            return $scope.filmExchangesTotal.slice(ITEMSPERPAGE*(page-1), ITEMSPERPAGE*page);
        }
        $scope.pageChanged = function(){
            $state.go('film-exchange', {page: $scope.currentPage}, {location: true, notify: false});
            $scope.filmExchanges = sliceData($scope.currentPage);
        };

        $scope.openFilmExchangeModal = function() {
            FilmExchangeTeamsModal.open($stateParams.id);
        };

        $scope.search = function(filter){
            filter.id = $stateParams.id;
            if(filter.teamName){
                filter.mascot = filter.teamName;
            }
            // console.log(filter);
            filmExchange.getFilms(filter).then(function(data){
                $state.go('film-exchange', {page: $scope.currentPage}, {location: true, notify: false});
                $scope.filmExchangesTotal = data;
                $scope.currentPage = 1;
                $scope.filmExchanges = sliceData($scope.currentPage);
            });
        };

    }
]);

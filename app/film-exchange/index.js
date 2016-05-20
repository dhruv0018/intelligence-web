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
                    'FilmExchangeFactory','$stateParams', 'SessionService',
                    function(filmExchange, $stateParams, session){
                        let exchangeId = $stateParams.id;
                        if(exchangeId){
                            return filmExchange.getFilms({id: exchangeId});
                        }else{
                            let currentUser = session.getCurrentUser();
                            let currentRole = currentUser.getCurrentRole();
                            return currentUser.getFilmExchangePrivileges(currentRole.id);
                        }
                    }
                ],
                'CompetitionLevels.Data':[
                    'FilmExchangeFactory', '$stateParams',
                    function(filmExchange, $stateParams){
                        let exchangeId = $stateParams.id;
                        return exchangeId ? filmExchange.getCompetitionLevel({id: exchangeId}) : [];
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
        $scope.noData = false;
        if(!$stateParams.id){
            //no id specified, go to first item
            if(typeof exchanges[0] !== 'undefined'){
                let exchangeId = exchanges[0].sportsAssociation+'+'+exchanges[0].conference+'+'+exchanges[0].gender+'+'+exchanges[0].sportId;
                $state.go('film-exchange', {id: exchangeId});
            }else{
                $scope.noData = true;
            }
        }
        if(!$scope.noData){
            let titleFilter = {};
            $scope.COACH = ROLES.COACH;
            $scope.currentPage = $stateParams.page||1;
            $scope.conferenceTitle = $stateParams.id.split('+');
            titleFilter.sportsAssociation = $scope.conferenceTitle[0];
            titleFilter.conference = $scope.conferenceTitle[1];
            titleFilter.gender = $scope.conferenceTitle[2];
            titleFilter.sportId = $scope.conferenceTitle[3];
            filmExchange.getAllConferences(titleFilter).then(function(data){
                $scope.filmExchangeName = data[0] && data[0].name;
            });
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
            $scope.searching = true;
            $scope.filmExchanges.length = 0;

            filter.id = $stateParams.id;
            if(filter.teamName){
                filter.mascot = filter.teamName;
            }

            $scope.query = filmExchange.getFilms(filter).then(function(data){
                $state.go('film-exchange', {page: $scope.currentPage}, {location: true, notify: false});
                $scope.filmExchangesTotal = data;
                $scope.currentPage = 1;
                $scope.filmExchanges = sliceData($scope.currentPage);
            }).finally(function(){
                $scope.searching = false;
            });
        };

    }
]);

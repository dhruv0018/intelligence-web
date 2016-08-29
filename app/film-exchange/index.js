/* Fetch angular from the browser scope */
var angular = window.angular;
const ITEMSPERPAGE = 10; //25

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
                        let start = ITEMSPERPAGE*($stateParams.page-1) || 0;
                        let count = ITEMSPERPAGE;
                        if (exchangeId) {
                            let teamId = session.getCurrentTeamId();
                            return filmExchange.getFilms({id: exchangeId, teamId, start, count});
                        } else {
                            let currentUser = session.getCurrentUser();
                            let currentRole = currentUser.getCurrentRole();
                            return currentUser.getFilmExchangePrivileges(currentUser.id);
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
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$filter',
    '$timeout',
    'CompetitionLevels.Data',
    'Exchange.Data',
    'FilmExchangeTeams.Modal',
    'RawFilm.Modal',
    'BasicModals',
    'SessionService',
    'AnalyticsService',
    'GamesFactory',
    'FilmExchangeFactory',
    'SportsFactory',
    'ROLES',
    function controller(
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $filter,
        $timeout,
        CompetitionLevels,
        exchanges,
        FilmExchangeTeamsModal,
        RawFilmModal,
        basicModals,
        session,
        analytics,
        games,
        filmExchangeFactory,
        sports,
        ROLES
    ) {
        $scope.currentUser = session.getCurrentUser();
        $scope.noData = false;
        $scope.isDefaultState = true;
        $scope.displayTableAnimations = true;

        if (!$stateParams.id) {
            //no id specified, go to first item
            if (typeof exchanges[0] !== 'undefined') {
                let exchangeId = exchanges[0].sportsAssociation+'+'+exchanges[0].conference+'+'+exchanges[0].gender+'+'+exchanges[0].sportId;
                $state.go('film-exchange', {id: exchangeId});
            } else {
                $scope.noData = true;
            }
        }
        if (!$scope.noData) {
            let titleFilter = {};
            $scope.COACH = ROLES.COACH;
            $scope.page = {};
            $scope.totalCount = exchanges.count;
            $scope.page.currentPage = $stateParams.page||1;
            $scope.conferenceTitle = $stateParams.id.split('+');
            titleFilter.sportsAssociation = $scope.conferenceTitle[0];
            titleFilter.conference = $scope.conferenceTitle[1];
            titleFilter.gender = $scope.conferenceTitle[2];
            titleFilter.sportId = $scope.conferenceTitle[3];
            filmExchangeFactory.getAllConferences(titleFilter).then(function(data){
                $scope.filmExchangeName = data[0] && data[0].name;
            });
            $scope.filter= {};
            $scope.itemPerPage = ITEMSPERPAGE;

            $scope.teamCompetitionLevels = CompetitionLevels.filter(item => item.code != null);
            angular.forEach($scope.teamCompetitionLevels, function(itm){
                itm.nameUsed= itm.code;
            });
            $scope.teamCompetitionLevels.unshift({'code': 0, 'nameUsed': 'None'});
            $scope.filteredFilms = exchanges.data;
            let removedFilms = [];
            $scope.todaysDate = Date.now();

        }

        function fetchData(filter, getHead = true){
            filter.id = $stateParams.id;
            filter.count = ITEMSPERPAGE;
            return filmExchangeFactory.getFilms(filter, getHead);
        }

        $scope.pageChanged = function() {
            // $state.go('film-exchange', {page: $scope.page.currentPage}, {location: 'replace', notify: false, reload: false, inherit: true});
            document.getElementById('film-exchange-data').scrollTop = 0;
            let filter = {};
            if($scope.filter.teamName && $scope.filter.teamName.length>0){
                filter.mascot = $scope.filter.teamName;
                filter.teamName = $scope.filter.teamName;
            }
            if($scope.filter.competitionLevel && $scope.filter.competitionLevel.length>0){
                filter.competitionLevel = $scope.filter.competitionLevel;
            }
            if($scope.filter.datePlayedTmp){
                filter.datePlayed = angular.copy($scope.filter.datePlayedTmp);
                let year = filter.datePlayed.toString().substr(11, 4);
                let month = (filter.datePlayed.getMonth() + 1).toString();
                if(month.length == 1) {month = "0"+month; }
                let day = filter.datePlayed.toString().substr(8, 2);
                filter.datePlayed = year+'-'+month+'-'+day;
            }
            filter.page = $scope.page.currentPage;
            if ($scope.currentUser.is(ROLES.COACH)) filter.teamId = session.getCurrentTeamId();
            fetchData(filter, false).then(responses=>{
                if(responses.count){
                    $scope.totalCount = responses.count;
                }
                $scope.filteredFilms = responses.data;
            });
        };

        $scope.openFilmExchangeModal = function() {
            FilmExchangeTeamsModal.open($stateParams.id);
        };

        $scope.searchFilms = searchFilms;
        function searchFilms(query) {
            $scope.searching = true;
            $scope.filteredFilms.length = 0;
            $scope.isDefaultState = false;
            $scope.displayTableAnimations = false;
            $scope.allFilms = [];
            $scope.filteredFilms = [];
            let filter = {};
            if ($scope.currentUser.is(ROLES.COACH)) filter.teamId = session.getCurrentTeamId();
            if (query.teamName) {
                filter.mascot = query.teamName;
                filter.teamName = query.teamName;
            } else {
                filter.mascot = null;
                filter.teamName = null;
            }
            if($scope.filter.datePlayedTmp){
                filter.datePlayed = angular.copy($scope.filter.datePlayedTmp);
                let year = filter.datePlayed.toString().substr(11, 4);
                let month = (filter.datePlayed.getMonth() + 1).toString();
                if(month.length == 1) {month = "0"+month; }
                let day = filter.datePlayed.toString().substr(8, 2);
                filter.datePlayed = year+'-'+month+'-'+day;
            }

            if(query.competitionLevel && query.competitionLevel.length>0){
                filter.competitionLevel = query.competitionLevel;
            }

            filter.page = 0;
            $scope.query = fetchData(filter).then(responses=>{
                $scope.page.currentPage = 1;
                // $state.go('film-exchange', {page: $scope.page.currentPage}, {location: true, notify: false});
                if(responses.count){
                    $scope.totalCount = responses.count;
                }
                $scope.filteredFilms = responses.data;
                $scope.searching = false;
            });
        }

        $scope.clearSearchFilter = function() {
            $scope.filter = {};
            searchFilms($scope.filter);
        };

        $scope.onRemoveClick = function($event, film) {
            $event.preventDefault();
            $event.stopPropagation();
            removeFromFilmExchange(film);
        };
        function removeFromFilmExchange(film) {
            let removeFromFilmExchangeModal = basicModals.openForConfirm({
                title: 'Remove Game',
                bodyHeader: film.awayTeam.name+' @ '+film.homeTeam.name,
                bodyText: 'Are you sure you want to remove this game from the film exchange?',
                bodySubtext: 'Note: this game will remain on your film home',
                buttonText: 'Remove'
            });

            removeFromFilmExchangeModal.result.then(() => {
                film.isPerformingAction = true;
                /* Track the event for MixPanel */
                analytics.track('Game Removed', {
                    'Film Exchange ID': $stateParams.id,
                    'Film Exchange Name': $scope.filmExchangeName
                });

                filmExchangeFactory.removeGameFromFilmExchange($stateParams.id, film.idFilmExchangeFilm).then(response => {
                    removedFilms.push(film);
                    film.isPerformingAction = false;
                });
            });
        }

        $scope.isFilmRemoved = function(film) {
            return removedFilms.some(removedFilm => film.idFilmExchangeFilm === removedFilm.idFilmExchangeFilm);
        };

        $scope.onCopyClick = function($event, film) {
            $event.preventDefault();
            $event.stopPropagation();
            copyFilm(film);
        };
        function copyFilm(film) {
            let bodyText = '';
            if (film.scoutingGame) {
                bodyText = 'This game will be copied into your film home as a scouting game.';
            } else {
                bodyText = 'This game will be copied into your film home as one of your games.';
            }

            let copyFilmModal = basicModals.openForConfirm({
                title: 'Copy Game',
                bodyHeader: film.awayTeam.name+' @ '+film.homeTeam.name,
                bodyText,
                bodySubtext: 'Note: The game will be viewable by the coaching staff and all active players. You will be able to submit this game for breakdown from your film home.',
                buttonText: 'Copy',
                successText: 'Game copied to your film home'
            });

            copyFilmModal.result.then(() => {
                film.isPerformingAction = true;

                let filmExchangeData = {
                    sportsAssociation: titleFilter.sportsAssociation,
                    conference: titleFilter.conference,
                    gender: titleFilter.gender,
                    sportId: titleFilter.sportId
                };

                /* Track the event for MixPanel */
                analytics.track('Game Copied', {
                    'Film Exchange ID': $stateParams.id,
                    'Film Exchange Name': $scope.filmExchangeName
                });

                // TODO: copyWithoutTeams will eventually not have to be hardcoded
                let copyInfo = {
                    copiedFromTeamId: film.addedByTeam,
                    copyWithoutTeams: false
                };
                let teamId = session.getCurrentTeamId();
                games.copyFromFilmExchange(copyInfo, film.id, teamId, filmExchangeData).then(response => {
                    film.isPerformingAction = false;
                    film.copyConfirm = true;
                    $timeout(() => {
                        film.copyConfirm = false;
                        film.copiedGame = true;
                    }, 2000);
                });
            });
        }

        $scope.openRawFilmModal = function(film) {
            if (film.video.status === 4) {
                RawFilmModal.open(film, removeFromFilmExchange, copyFilm, trackEmailClick);
            }
        };

        $scope.onUserEmailClick = function(film, $event) {
            $event.stopPropagation();
            trackEmailClick(film);
        };

        function trackEmailClick(film) {
            /* Track the event for MixPanel */
            analytics.track('Coach Contacted', {
                'Contact Name': film.addedByUser.firstName+film.addedByUser.lastName,
                'Contact Email': film.addedByUser.email,
                'Contact Team ID': film.addedByTeam.id,
                'Contact Team Name': film.addedByTeam.name,
                'Film Exchange ID': $stateParams.id,
                'Film Exchange Name': $scope.filmExchangeName
            });
        }
    }
]);

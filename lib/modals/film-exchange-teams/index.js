/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * SelectIndexer page module.
 * @module SelectIndexer
 */
var FilmExchangeTeams = angular.module('FilmExchangeTeams', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
FilmExchangeTeams.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('film-exchange-teams.html', template);
    }
]);

/**
 * FilmExchange Modal
 * @module FilmExchange
 * @name FilmExchange.Modal
 * @type {service}
 */
FilmExchangeTeams.value('FilmExchangeTeams.ModalOptions', {

    templateUrl: 'film-exchange-teams.html',
    controller: 'FilmExchangeTeams.controller'
});


/**
 * FilmExchange modal dialog.
 * @module FilmExchange
 * @name FilmExchange.Modal
 * @type {service}
 */
FilmExchangeTeams.service('FilmExchangeTeams.Modal',[
    '$modal', 'FilmExchangeTeams.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(id) {

                var resolves = {

                    resolve: {
                        exchangeId: function(){return id; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * FilmExchagne controller.
 * @module FilmExchagne
 * @name FilmExchagne.controller
 * @type {controller}
 */
FilmExchangeTeams.controller('FilmExchangeTeams.controller', ['$scope', 'FilmExchangeFactory', 'exchangeId', 'KEYBOARD_CODES','filterFilter',
    function controller($scope, filmExchange, exchangeId, KEYBOARD_CODES, filterFilter) {
        var conferenceId = exchangeId;
        $scope.pagination = {
            currentPage: 0,
            pageSize: 10
        };
        $scope.teams = [];
        $scope.paginatedTeams = [];

        $scope.toggleShowSuspendedTeams = function() {
            if(event.target.checked === true) {
                $scope.supsendedTeams = 1;
            } else {
                $scope.supsendedTeams = null;
            }
            $scope.teams = [];
            $scope.offset = 0;
            $scope.pagination.currentPage = 0;
            $scope.endOfList = false;
            $scope.loadMore();
        };
        /* search related function */
        $scope.searchTeams = function(name){
            $scope.teams = [];
            $scope.offset = 0;
            $scope.pagination.currentPage = 0;
            $scope.endOfList = false;
            $scope.loadMore();
        };

        $scope.toggleSuspend = function(teamId){
            if(event.target.checked === false) {
                filmExchange.unsuspendTeam(conferenceId, teamId).then(function(response) {

                }, function(error){
                    throw new Error('error unsuspend Team '+teamId + ' conference '+conferenceId);
                });
            } else {
                filmExchange.suspendTeam(conferenceId, teamId).then(function(response) {

                }, function(error){
                    throw new Error('error suspend Team '+teamId + ' conference '+conferenceId);
                });
            }
        };

        $scope.loadMore = function() {
            if ($scope.loadingResult) {
                return;
            }

            if ($scope.endOfList) {
                return;
            }
            $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
            $scope.offset = ($scope.pagination.currentPage - 1) * $scope.pagination.pageSize;
            $scope.limit = $scope.pagination.pageSize;
            $scope.loadingResult = true;

            let filter = {};
            filter.id = conferenceId;
            filter.start = $scope.offset;
            filter.count = $scope.limit;
            filter.isSuspended = $scope.supsendedTeams;
            if($scope.filters){
                filter.mascot = $scope.filters.name;
                filter.schoolName = $scope.filters.name;
            }

            filmExchange.getTeams(filter).then(function(response) {
                $scope.paginatedTeams = response;
                $scope.teams = $scope.teams.concat($scope.paginatedTeams);
                $scope.loadingResult = false;
                if (response.length < 10) {
                    $scope.endOfList = true;
                }

            }, function(error){
                throw new Error('error fetching Team '+teamId + ' conference '+conferenceId);
            });
        };

        $scope.initializeResultList = function() {
            $scope.endOfList = false;
            $scope.loadMore();
        };

        $scope.initializeResultList();
    }
]);

const angular = window.angular;

/**
 * Film Exchange Teams controller class
 * @class FilmExchangeTeams
 */

FilmExchangeTeamsController.$inject = [
    '$scope',
    'FilmExchangeFactory',
    'exchangeId',
    'KEYBOARD_CODES',
    'filterFilter'
];

function FilmExchangeTeamsController (
    $scope,
    filmExchange,
    exchangeId,
    KEYBOARD_CODES,
    filterFilter
) {
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
            filter.teamName = $scope.filters.name;
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

export default FilmExchangeTeamsController;

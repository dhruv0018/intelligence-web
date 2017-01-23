const angular = window.angular;

UsersController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$q',
    '$modal',
    '$stateParams',
    'SportsFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'UsersFactory',
    'SessionService',
    'AccountService',
    'AdminSearchService',
    'ROLES',
    'Admin.Users.Data'
];

/**
 * Users controller. Controls the view for displaying multiple users.
 * @module Users
 * @name Users.Controller
 * @type {Controller}
 */
function UsersController(
    $rootScope,
    $scope,
    $state,
    $q,
    $modal,
    $stateParams,
    sports,
    leagues,
    teams,
    users,
    session,
    account,
    searchService,
    ROLES,
    data
) {

    const ITEMSPERPAGE = 30; // max number of users per page

    $scope.ROLES = ROLES;
    $scope.HEAD_COACH = ROLES.HEAD_COACH;
    $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
    $scope.ATHLETE = ROLES.ATHLETE;
    $scope.itemPerPage = ITEMSPERPAGE;
    $scope.page = {};
    $scope.page.currentPage = $stateParams.page || 1;

    $scope.account = account;

    $scope.users = [];

    $scope.Users = users;
    $scope.statuses = [{value: 0, label: 'Active'}, {value: 1, label: 'Inactive'}];

    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();

    $scope.filter = searchService.users.filter;

    $scope.add = () => $state.go('user-info', {location: true});

    $scope.search = function(filter) {

        $scope.searching = true;
        $scope.users.length = 0;

        if (filter.id) {
            let deferred = $q.defer();
            $scope.query = deferred.promise;

            users.load(filter.id)
            .then(function() {
                $state.go('user-info', { id: filter.id});
            })
            .finally(function() {
                $scope.teams = [];
                $scope.searching = false;
                deferred.resolve();
            });
        }
        else {
            $scope.page.currentPage = 1;
            $scope.query = users.getUsersList(filter).then(response =>{
                $scope.users = response.data;
                $scope.totalCount = response.count;
            }).finally(()=>{
                $scope.searching = false;
            });
        }
    };

    $scope.pageChanged = function(){
        delete $scope.filter.start;
        document.getElementById('user-data').scrollTop = 0;
        let filter = angular.copy($scope.filter);
        filter.page = $scope.page.currentPage;

        $scope.searching = true;
        $scope.users.length = 0;

        $scope.query = users.getUsersList(filter, false).then(response =>{
            $scope.users = response.data;
        }).finally(()=>{
            $scope.searching = false;
        });
    };

    $scope.clearSearchFilter = function() {
        searchService.users.clear();
        $scope.filter = {};
        $scope.users = [];
    };

    // Restore the state of the previous search from the service
    if (Object.keys($scope.filter).length && !$scope.filter.id) {
        $scope.search($scope.filter);
    }
}

export default UsersController;

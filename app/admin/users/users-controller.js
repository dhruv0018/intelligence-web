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

    $scope.ROLES = ROLES;
    $scope.HEAD_COACH = ROLES.HEAD_COACH;
    $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
    $scope.ATHLETE = ROLES.ATHLETE;

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
            $scope.query = users.search(filter).then(function(users) {

                $scope.users = users;

            }).finally(function() {

                $scope.searching = false;
            });
        }
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

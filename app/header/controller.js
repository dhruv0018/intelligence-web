const angular = window.angular;

HeaderController.$inject = [
    '$scope',
    '$state',
    'config',
    'AuthenticationService',
    'SessionService',
    'AccountService',
    'UsersFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'SPORTS',
    'SPORT_IDS',
    'SUBSCRIPTIONS',
    'USER_PERMISSIONS',
    'ROLES',
    'ROLE_TYPE',
    'Header.Data',
    '$timeout'
];

/**
 * Header controller
 */
function HeaderController(
    $scope,
    $state,
    config,
    auth,
    session,
    account,
    users,
    leagues,
    teams,
    SPORTS,
    SPORT_IDS,
    SUBSCRIPTIONS,
    USER_PERMISSIONS,
    ROLES,
    ROLE_TYPE,
    data,
    $timeout
) {
    $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
    $scope.ADMIN = ROLES.ADMIN;
    $scope.INDEXER = ROLES.INDEXER;
    $scope.HEAD_COACH = ROLES.HEAD_COACH;
    $scope.COACH = ROLES.COACH;
    $scope.ATHLETE = ROLES.ATHLETE;
    $scope.FILM_EXCHANGE_ADMIN = ROLES.FILM_EXCHANGE_ADMIN;

    $scope.auth = auth;
    $scope.config = config;
    $scope.$state = $state;
    $scope.session = session;
    $scope.account = account;

    let currentUser = session.getCurrentUser();
    let currentRole = currentUser.getCurrentRole();
    $scope.currentUserIsAthleteRecruit = currentUser.isAthleteRecruit();
    $scope.canPickupGame = currentUser.canPickupGames();

    if (currentRole.teamId) {
        //get only the active film exchanges for coach
        $scope.filmExchanges = [];
        teams.getFilmExchanges(currentRole.teamId).then(function(filmExchanges) {
            angular.forEach(filmExchanges, function(filmExchange) {
                filmExchange.id = filmExchange.sportsAssociation+'+'+filmExchange.conference+'+'+filmExchange.gender+'+'+filmExchange.sportId;
                    $scope.filmExchanges.push(filmExchange);
            });
        });
    }

    if(currentUser.is(ROLES.FILM_EXCHANGE_ADMIN)||currentUser.is(ROLES.ATHLETE)||currentUser.is(ROLES.INDEXER)){
        $scope.isMinMenu = true;
    }
    //If FILM EXCHANGE ADMIN GET ALL THE FILM EXCHANGE LIST THEY BELONG
    if (currentUser.is(ROLES.FILM_EXCHANGE_ADMIN)) {
        currentUser.getFilmExchangePrivileges(currentUser.id).then(function(filmExchanges) {
            $scope.filmExchanges = angular.forEach(filmExchanges, function(filmExchange){
                filmExchange.id = filmExchange.sportsAssociation+'+'+filmExchange.conference+'+'+filmExchange.gender+'+'+filmExchange.sportId;
            });
        });
    }

    //User permissions for admin roles
    if(currentUser.is(ROLES.SUPER_ADMIN) || currentUser.is(ROLES.ADMIN)) {
        $scope.hasAllocationSettingsPermissions = data.userPermissions.data.some(permission => {
            return permission.attributes.action === USER_PERMISSIONS.ALLOCATION_SETTINGS.action;
        });
        $scope.hasDailyLogsPermissions = data.userPermissions.data.some(permission => {
            return permission.attributes.action === USER_PERMISSIONS.DAILY_LOGS.action;
        });
    }

    //TODO: Create a getRolesOneAthlete that gets one athlete role
    let userRoles = currentUser.getRoles();
    let athleteIncluded = false;

    // NOTE: Only get one athlete role for display in the dropdown, since all athlete roles are treated as one
    // Get all other roles as normal
    $scope.dropdownUserRoles = userRoles.filter(function(role) {
        if (role.type.id === ROLE_TYPE.ATHLETE) {
            if (!athleteIncluded) {
                athleteIncluded = true;
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    });

    if (auth.isLoggedIn) {
        if (currentUser.is(ROLES.COACH)) {
            let team = teams.get(currentUser.currentRole.teamId);
            $scope.league = leagues.get(team.leagueId);
            $scope.SPORTS = SPORTS;
            $scope.SPORT_IDS = SPORT_IDS;
            $scope.showOldFilmHome = team.sportId === SPORTS.FOOTBALL.id || team.sportId === SPORTS.VOLLEYBALL.id;
            if(SPORT_IDS[$scope.league.sportId] && SPORTS[SPORT_IDS[$scope.league.sportId]].hasInsights && $scope.showOldFilmHome && SPORTS[SPORT_IDS[$scope.league.sportId]].hasAnalytics){
                $scope.isMaxMenu = true;
            }else{
                $scope.isMaxMenu = false;
            }
        } else if (currentUser.is(ROLES.ATHLETE)) {
            let team = teams.get(currentUser.currentRole.teamId);
            $scope.showOldFilmHome = team.sportId === SPORTS.FOOTBALL.id || team.sportId === SPORTS.VOLLEYBALL.id;
        }
    }

    $scope.subMenu = {};

    $scope.toggleSubMenu = function($event, index) {
        $event.stopPropagation();

        if(!$scope.subMenu[index]){
            $scope.subMenu[index] = true;
        }
        else{
            $scope.subMenu[index] = false;
        }
    };
}

export default HeaderController;

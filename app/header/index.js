/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Header
 * @module Header
 */
var Header = angular.module('header', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Header.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('header.html', template);
    }
]);

/**
 * Header state router.
 * @module Header
 * @type {UI-Router}
 */
Header.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('base', {
                url: '',
                parent: 'root',
                abstract: true,
                views: {
                    'header@root': {
                        templateUrl: 'header.html',
                        controller: HeaderController
                    }
                },
                resolve: {
                    'Header.Data': [
                        '$q', 'Header.Data.Dependencies',
                        function($q, data) {

                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);


Header.factory('Header.Data.Dependencies', [
    'AuthenticationService', 'SessionService', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory', '$q', 'ROLE_TYPE',
    function(auth, session, sports, leagues, teams, users, $q, ROLE_TYPE) {

        var Data = {

            get sports() { return sports.load(); },
            get leagues() { return leagues.load(); },

            get teams() {

                if (auth.isLoggedIn) {

                    let currentId = session.getCurrentUserId();

                    // Only use relatedRoleId call for coaches - Athletes need relatedUserId to ensure all teams are loaded
                    if(session.getCurrentRoleTypeId() == ROLE_TYPE.HEAD_COACH || session.getCurrentRoleTypeId() == ROLE_TYPE.ASSISTANT_COACH){

                        let deferred = $q.defer();

                        // Load a fresh copy of the user to get the latest role ID
                        // TODO: Remove this once role IDs are locked down and user cache
                        //       problems with old, potentially changed role IDs are cleared
                        users.load(currentId).then(function(){
                            let role = users.get(currentId).getCurrentRole();

                            teams.load({ relatedRoleId: role.id }).then(function(){deferred.resolve();});
                        });

                        return deferred.promise;
                    }
                    else
                    {
                        return teams.load({ relatedUserId: currentId });
                    }

                }
            }
        };

        return Data;
    }
]);

/* Header controller dependencies */
HeaderController.$inject = [
    'config',
    '$scope',
    '$state',
    'AuthenticationService',
    'SessionService',
    'AccountService',
    'ROLES',
    'ROLE_TYPE',
    'UsersFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'SPORTS',
    'SPORT_IDS',
    'SUBSCRIPTIONS'
];

/**
 * Header controller.
 * @module Header
 * @name HeaderController
 * @type {Controller}
 */

function HeaderController(
    config,
    $scope,
    $state,
    auth,
    session,
    account,
    ROLES,
    ROLE_TYPE,
    users,
    leagues,
    teams,
    SPORTS,
    SPORT_IDS,
    SUBSCRIPTIONS
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

    if(currentRole.teamId){
        //get only the active ones for coach
        $scope.filmExchanges = [];
        teams.getFilmExchanges(currentRole.teamId).then(function(filmExchanges) {
            angular.forEach(filmExchanges, function(filmExchange){
                filmExchange.id = filmExchange.sportsAssociation+'+'+filmExchange.conference+'+'+filmExchange.gender+'+'+filmExchange.sportId;
                    $scope.filmExchanges.push(filmExchange);
            });
        });
    }

    //If FILM EXCHANGE ADMIN GET ALL THE FILM EXCHANGE LIST THEY BELONG
    if(currentUser.is(ROLES.FILM_EXCHANGE_ADMIN)){
        currentUser.getFilmExchangePrivileges(currentUser.id).then(function(filmExchanges){
            $scope.filmExchanges = angular.forEach(filmExchanges, function(filmExchange){
                filmExchange.id = filmExchange.sportsAssociation+'+'+filmExchange.conference+'+'+filmExchange.gender+'+'+filmExchange.sportId;
            });
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

    //TEMP - get sport id to show Analytics tab for FB only
    if (auth.isLoggedIn) {
        if (currentUser.is(ROLES.COACH)) {
            let team = teams.get(currentUser.currentRole.teamId);
            $scope.league = leagues.get(team.leagueId);
            $scope.SPORTS = SPORTS;
            $scope.SPORT_IDS = SPORT_IDS;
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

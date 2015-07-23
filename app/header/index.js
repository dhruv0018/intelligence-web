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
    'AuthenticationService', 'SessionService', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory',
    function(auth, session, sports, leagues, teams) {

        var Data = {

            get sports() { return sports.load(); },
            get leagues() { return leagues.load(); },

            get teams() {

                if (auth.isLoggedIn) {

                    var userId = session.currentUser.id;

                    return teams.load({ relatedUserId: userId });
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
    users,
    leagues,
    teams,
    SPORTS,
    SPORTS_IDS,
    SUBSCRIPTIONS
) {
    $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
    $scope.ADMIN = ROLES.ADMIN;
    $scope.INDEXER = ROLES.INDEXER;
    $scope.HEAD_COACH = ROLES.HEAD_COACH;
    $scope.COACH = ROLES.COACH;
    $scope.ATHLETE = ROLES.ATHLETE;

    $scope.auth = auth;
    $scope.config = config;
    $scope.$state = $state;
    $scope.session = session;
    $scope.account = account;

    let currentUser = session.currentUser;
    $scope.currentUserIsAthleteRecruit = currentUser.isAthleteRecruit();

    //TEMP - get sport id to show Analytics tab for FB only
    if (auth.isLoggedIn) {
        if (currentUser.is(ROLES.COACH)) {
            var team = teams.get(currentUser.currentRole.teamId);
            $scope.league = leagues.get(team.leagueId);
            $scope.SPORTS = SPORTS;
            $scope.SPORTS_IDS = SPORTS_IDS;
        }
    }

    // This scope functionality limits a menu element to only one sub-menu
    $scope.subMenu = false;

    $scope.toggleSubMenu = function($event) {
        $event.stopPropagation();
        $scope.subMenu = !$scope.subMenu;
    };
}

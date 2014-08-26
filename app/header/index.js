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
                        controller: 'HeaderController'
                    }
                },
                resolve: {
                    'Base.Data': [
                        '$q', 'SessionService', 'TeamsFactory', 'Base.Data.Dependencies',
                        function($q, session, teams, data) {

                            var teamId = session.currentUser.currentRole.teamId;

                            if (teamId) {

                                var team = teams.load(teamId);

                                return $q.all([team, data]);
                            }

                            else return $q.all(data);
                        }
                    ]
                }
            });
    }
]);


Header.service('Base.Data.Dependencies', [
    'SportsFactory', 'LeaguesFactory', 'TagsetsFactory', 'FiltersetsFactory', 'PositionsetsFactory',
    function(sports, leagues, tagsets, filtersets, positionsets) {

        var Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            tagsets: tagsets.load(),
            filtersets: filtersets.load(),
            positionsets: positionsets.load()
        };

        return Data;
    }
]);


/**
 * Header controller.
 * @module Header
 * @name HeaderController
 * @type {Controller}
 */
Header.controller('HeaderController', [
    'config', '$scope', '$state', 'AuthenticationService', 'SessionService', 'AccountService', 'ROLES',
    function controller(config, $scope, $state, auth, session, account, ROLES) {

        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;
        $scope.INDEXER = ROLES.INDEXER;
        $scope.COACH = ROLES.COACH;

        $scope.config = config;

        $scope.$state = $state;

        $scope.account = account;

        $scope.logout = function() {

            auth.logoutUser();
            $state.go('login');
        };
    }
]);


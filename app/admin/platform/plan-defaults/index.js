/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Plan Defaults
 * @module Plan Defaults
 */
var PlanDefaults = angular.module('plan-defaults', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
PlanDefaults.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('plan-defaults.html', template);
    }
]);

/**
 * Plan Defaults state router.
 * @module Plan Defaults
 * @type {UI-Router}
 */
PlanDefaults.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('base', {
                url: '',
                parent: 'root',
                abstract: true,
                views: {
                    'header@root': {
                        templateUrl: 'plan-defaults.html',
                        controller: 'PlanDefaultsController'
                    }
                }
            });
    }
]);

/**
 * Plan Defaults controller.
 * @module Plan Defaults
 * @name PlanDefaultsController
 * @type {Controller}
 */
PlanDefaults.controller('HeaderController', [
    'config', '$scope', '$state', 'AuthenticationService', 'SessionService', 'AccountService', 'ROLES',
    function controller(config, $scope, $state, auth, session, account, ROLES) {
    }
]);


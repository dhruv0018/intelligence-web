/* Component dependencies. */
require('plan');
require('game-info');
require('your-team');
require('opposing-team');
require('instructions');

/* Component settings */
var templateUrl = 'coach/add-film/uploading.html';

/* Component resources */
var template = require('./uploading.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Uploading film page module.
 * @module UploadingFilm
 */
var UploadingFilm = angular.module('uploading-film', [
    'ui.router',
    'ui.bootstrap',
    'plan',
    'game-info',
    'your-team',
    'opposing-team',
    'instructions'
]);

/* Cache the template file */
UploadingFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Uploading film page state router.
 * @module UploadingFilm
 * @type {UI-Router}
 */
UploadingFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var uploadingFilm = {
            name: 'uploading-film',
            parent: 'add-film',
            url: '',
            views: {
                'content@add-film': {
                    templateUrl: 'coach/add-film/uploading.html',
                    controller: 'UploadingFilmController'
                }
            }
        };

        $stateProvider.state(uploadingFilm);
    }
]);

/**
 * Uploading tabs value service.
 * @module UploadingFilm
 * @name UploadingFilmTabs
 * @type {Controller}
 */
UploadingFilm.value('UploadingFilmTabs', {

    'game-info':     { active: true, disabled: false },
    'your-team':     { active: false, disabled: true },
    'opposing-team': { active: false, disabled: true },
    instructions:    { active: false, disabled: true }
});

/**
 * UploadingFilm controller.
 * @module UploadingFilm
 * @name UploadingFilmController
 * @type {Controller}
 */
UploadingFilm.controller('UploadingFilmController', [
    '$rootScope', '$scope', '$state', 'UploadingFilmTabs',
    function controller($rootScope, $scope, $state, tabs) {

        $scope.tabs = tabs;

        $scope.cancel = function() {

            $scope.$flow.cancel();
            $state.go('add-film');
        };

        $scope.$on('flow::error', function(event, $flow, $message) {

            $scope.error = true;
        });

        $scope.$on('flow::complete', function() {

            if (!$scope.error) $scope.complete = true;
        });
    }
]);


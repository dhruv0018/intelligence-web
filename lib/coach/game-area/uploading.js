/* Component dependencies. */
//require('game-info');
//require('your-team');
//require('opposing-team');
//require('instructions');

///* Component settings */
//var templateUrl = 'coach/game-area/uploading.html';
//
///* Component resources */
//var template = require('./uploading.html');
//
///* Fetch angular from the browser scope */
//var angular = window.angular;
//
///**
//* Uploading film page module.
//* @module UploadingFilm
//*/
//var UploadingFilm = angular.module('uploading-film', [
//    'ui.router',
//    'ui.bootstrap',
//    'game-info',
//    'your-team',
//    'opposing-team',
//    'instructions'
//]);

///* Cache the template file */
//UploadingFilm.run([
//    '$templateCache',
//    function run($templateCache) {
//
//        $templateCache.put(templateUrl, template);
//    }
//]);
//
///**
//* Uploading film page state router.
//* @module UploadingFilm
//* @type {UI-Router}
//*/
//UploadingFilm.config([
//    '$stateProvider', '$urlRouterProvider',
//    function config($stateProvider, $urlRouterProvider) {
//
//        var uploadingFilm = {
//            name: 'uploading-film',
//            parent: 'game-area',
//            url: '',
//            views: {
//                'content@game-area': {
//                    templateUrl: 'coach/game-area/uploading.html',
//                    controller: 'UploadingFilmController'
//                }
//            }
//        };
//
//        $stateProvider.state(uploadingFilm);
//    }
//]);
//
///**
//* Uploading tabs value service.
//* @module UploadingFilm
//* @name UploadingFilmTabs
//* @type {Controller}
//*/
//UploadingFilm.value('UploadingFilmTabs', {
//
//    'game-info':     { active: true, disabled: false },
//    'your-team':     { active: false, disabled: true },
//    'opposing-team': { active: false, disabled: true },
//    instructions:    { active: false, disabled: true }
//});
//
///**
//* UploadingFilm controller.
//* @module UploadingFilm
//* @name UploadingFilmController
//* @type {Controller}
//*/
//UploadingFilm.controller('UploadingFilmController', [
//    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'GamesFactory', 'UploadingFilmTabs',
//    function controller(config, $rootScope, $scope, $state, $localStorage, $http, games, tabs) {
//
//        $scope.$storage = $localStorage;
//
//        $scope.tabs = tabs;
//
//]);
//

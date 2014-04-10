/* Component dependencies */
require('coach-game');
require('film-home');
require('game-area');
require('add-film');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach module.
 * @module Coach
 */
var Coach = angular.module('Coach', [
    'Coach.Game',
    'Coach.FilmHome',
    'Coach.GameArea',
    'add-film'
]);

/**
 * Coach state router.
 * @module Coach
 * @type {UI-Router}
 */
Coach.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var Coach = {
            name: 'Coach',
            url: '/coach',
            parent: 'base',
            abstract: true
        };

        $stateProvider.state(Coach);
    }
]);


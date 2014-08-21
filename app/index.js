require('root');
require('login');
require('logout');
require('header');
require('account');
require('admin');
require('coach');
require('athlete');
require('indexer');
require('indexing');
require('games');
require('clips');
require('stylesheet');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * App module.
 * @module App
 */
var App = angular.module('App', [
    'root',
    'login',
    'logout',
    'header',
    'Account',
    'Admin',
    'indexer',
    'Indexing',
    'Coach',
    'Athlete',
    'Games',
    'Clips',
    'Reel',
    'stylesheet'
]);

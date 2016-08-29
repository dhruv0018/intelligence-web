require('updated-terms-and-conditions');
require('root');
require('login');
require('logout');
require('admin');
require('coach');
require('athlete');
require('indexing');
require('clips');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * App module.
 * @module App
 */
var App = angular.module('App', [
    'UpdatedTermsAndConditions',
    'root',
    'login',
    'logout',
    'header',
    'Account',
    'Admin',
    'Indexer',
    'Indexing',
    'FilmHome',
    'Coach',
    'Athlete',
    'Games',
    'Clips',
    'Reel',
    'Analytics',
    'Embed',
    'Styleguide'
]);

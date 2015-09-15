require('updated-terms-and-conditions');
require('root');
require('login');
require('logout');
require('header');
require('account');
require('admin');
require('coach');
require('athlete');
require('indexing');
require('games');
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
    'Coach',
    'Athlete',
    'Games',
    'Clips',
    'Reel',
    'Embed',
    'Styleguide'
]);

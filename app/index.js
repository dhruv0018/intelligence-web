require('root');
require('login');
require('header');
require('account');
require('admin');
require('coach');
require('indexer');
require('indexing');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * App module.
 * @module App
 */
var App = angular.module('App', [
    'root',
    'login',
    'header',
    'account',
    'Admin',
    'indexer',
    'Indexing',
    'Coach'
]);


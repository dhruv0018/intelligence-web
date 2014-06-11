require('users');
require('teams');
require('schools');
require('queue');
require('platform');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Admin module.
 * @module Admin
 */
var Admin = angular.module('Admin', [
    'Users',
    'teams',
    'schools',
    'queue',
    'platform'
]);

Admin.service('Admin.Data', [
    'Base.Data',
    function(data) {

        var Data = {

        };

        angular.extend(Data, data);

        return Data;
    }
]);
/**
 * Admin state router.
 * @module Admin
 * @type {UI-Router}
 */
Admin.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var admin = {
            name: 'admin',
            url: '/admin',
            parent: 'base',
            abstract: true,
            resolve: {
                'Admin.Data': [
                    '$q', 'Admin.Data',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        };

        $stateProvider.state(admin);
    }
]);


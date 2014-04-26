/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Admin module.
 * @module Admin
 */
var Admin = angular.module('admin', [
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
            abstract: true
        };

        $stateProvider.state(admin);
    }
]);


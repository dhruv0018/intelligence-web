/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Edit Profile page module.
 * @module Profile
 */
var EditProfile = angular.module('Athlete.EditProfile');

/**
 * Edit Profile page state router.
 * @module Edit Profile
 * @type {UI-Router}
 */
EditProfile.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Athlete.EditProfile', {
            url: '/edit-profile',
            views: {
                'main@root': {
                    templateUrl: 'athlete/edit-profile/template.html',
                    controller: 'Athlete.EditProfile.controller'
                }
            },
            resolve: {
                'Athlete.EditProfile.Data': [
                    '$q', 'Athlete.EditProfile.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

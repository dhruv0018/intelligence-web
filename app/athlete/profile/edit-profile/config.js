/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Edit Profile page module.
 * @module Profile
 */
var EditProfile = angular.module('Athlete.Profile.EditProfile');

/**
 * Edit Profile page state router.
 * @module Edit Profile
 * @type {UI-Router}
 */
EditProfile.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile', {
            url: '/edit-profile',
            abstract: true,
            views: {
                'main@root': {
                    templateUrl: 'athlete/edit-profile/template.html',
                    controller: 'Athlete.Profile.EditProfile.controller'
                }
            },
            resolve: {
                'Athlete.Profile.EditProfile.Data': [
                    '$q', 'Athlete.Profile.EditProfile.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

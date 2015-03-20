/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile page module.
 * @module Profile
 */
var Profile = angular.module('Athlete.Profile');

/**
 * Profile page state router.
 * @module Profile
 * @type {UI-Router}
 */
Profile.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Athlete.Profile', {
            url: '/:id/profile',
            views: {
                'main@root': {
                    templateUrl: 'athlete/profile/template.html',
                    controller: 'Athlete.Profile.controller'
                }
            },
            resolve: {
                'Athlete.Profile.Data': [
                    '$q', 'Athlete.Profile.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

/**
 * Athlete Profile Data Service
 * @module Athlete.Profile
 * @type {service}
 */
Profile.service('Athlete.Profile.Data.Dependencies',[
    '$stateParams', 'UsersFactory', 'ReelsFactory',
    function data($stateParams, users, reels) {

        var userId = $stateParams.id;

        var Data = {
            users: users.load({relatedUserId: userId}),
            reels: reels.load({userId: userId}) // For Athlete.Profile.Highlights, no access to userId
        };

        return Data;
    }
]);

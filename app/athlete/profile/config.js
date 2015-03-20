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
                    '$q', '$stateParams', 'UsersFactory', 'ReelsFactory',
                    function data($q, $stateParams, users, reels) {

                        let userId = $stateParams.id;

                        let Data = {
                            users: users.load({relatedUserId: userId}),
                            reels: reels.load({userId: userId}) // For Athlete.Profile.Highlights, no access to userId
                        };

                        return $q.all(Data);
                    }
                ]
            }
        });
    }
]);

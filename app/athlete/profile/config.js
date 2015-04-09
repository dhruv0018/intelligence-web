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
                    '$q',
                    '$stateParams',
                    'UsersFactory',
                    'ReelsFactory',
                    'PlaysFactory',
                    function data(
                                $q,
                                $stateParams,
                                users,
                                reels,
                                plays) {

                        let userId = $stateParams.id;

                        /* Load data for Athlete.Profile.<sub-state> upfront
                         */

                        return users.load({relatedUserId: userId}).then(function() {
                            return reels.load({relatedUserId: userId}).then(function() {
                                let user = users.get(userId);
                                let featuredReel = reels.getFeaturedReel(user);
                                return plays.load(featuredReel.plays);
                            });
                        });
                    }
                ],
                userId: [
                    '$stateParams',
                    function($stateParams){
                        return $stateParams.id;
                    }
                ]
            }
        });
    }
]);

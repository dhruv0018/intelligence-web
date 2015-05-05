/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/template.html';

/**
 * Profile page module.
 * @module Profile
 */
const Profile = angular.module('Athlete.Profile');

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
                    templateUrl: templateUrl,
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
                    'SportsFactory',
                    'PositionsetsFactory',
                    function data(
                                $q,
                                $stateParams,
                                users,
                                reels,
                                plays,
                                sports,
                                positionsets) {

                        let userId = $stateParams.id;

                        /* Load data for Athlete.Profile.<sub-state> upfront

                        userpromise = users.load
                        reelspromise = userpromise.then(function)

                        data {
                            user: userpromise
                            reels
                         */

                        let relatedUsers = users.load({relatedUserId: userId});

                        let relatedReels = relatedUsers.then(function() {
                            return reels.load({relatedUserId: userId});
                        });

                        let relatedPlays = relatedReels.then(function() {
                            let user = users.get(userId);
                            let featuredReel = reels.getFeaturedReel(user);
                            if (featuredReel) return plays.load(featuredReel.plays);
                        });

                        return $q.all([relatedUsers, relatedReels, relatedPlays, positionsets.load(), sports.load()]);
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

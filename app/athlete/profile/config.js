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

                        let userId = Number($stateParams.id);

                        let relatedUsers = users.load(userId);

                        let Data = {
                            positionsets: positionsets.load(),
                            sports: sports.load(),
                            users: relatedUsers,
                            reels: reels.load({relatedUserId: userId}),
                            plays: relatedUsers.then(() => {
                                let user = users.get(userId);
                                if (user.profile.featuredReelId) return plays.load({reelId: user.profile.featuredReelId});
                            })
                        };

                        return $q.all(Data);
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

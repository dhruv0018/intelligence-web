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
                    'TeamsFactory',
                    'PositionsetsFactory',
                    'TagsetsFactory',
                    function data(
                        $q,
                        $stateParams,
                        users,
                        reels,
                        plays,
                        sports,
                        teams,
                        positionsets,
                        tagsets
                    ) {

                        let userId = Number($stateParams.id);

                        let relatedUser = users.load(userId);



                        let Data = {
                            positionsets: positionsets.load(),
                            tagsets: tagsets.load(),
                            sports: sports.load(),
                            users: relatedUser,
                            reels: reels.load({relatedUserId: userId}),
                            plays: relatedUser.then(() => {
                                let user = users.get(userId);
                                if (user.profile.reelIds[0]) return plays.load({reelId: user.profile.reelIds[0]});
                            }),
                            teams: relatedUser.then(() => {
                                let user = users.get(userId);

                                if (user.profile.teams.length) {
                                    let teamIds = user.profile.teams.map(function getProfileTeamIds(team) {
                                        return team.teamId;
                                    });

                                    return teams.load(teamIds);
                                }
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

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
                    'PlayersFactory',
                    function data(
                        $q,
                        $stateParams,
                        users,
                        reels,
                        plays,
                        sports,
                        teams,
                        positionsets,
                        tagsets,
                        players
                    ) {

                        let userId = Number($stateParams.id);

                        let relatedUsers = users.load({relatedUserId: userId});

                        let Data = {
                            positionsets: positionsets.load(),
                            tagsets: tagsets.load(),
                            sports: sports.load(),
                            players: players.load({userId}),
                            users: relatedUsers,
                            reels: reels.load({relatedUserId: userId}),
                            plays: relatedUsers.then(() => {
                                const user = users.get(userId);
                                const reelIds = user.profile.reelIds;
                                if (reelIds[0]) return plays.load({reelId: reelIds[0]});
                            }),
                            teams: relatedUsers.then(() => {
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

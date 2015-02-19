/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Achievements page module.
 * @module EditProfile.Achievements
 */
var Achievements = angular.module('Athlete.EditProfile.Achievements');

/**
 * EditProfile.Achievements page state router.
 * @module EditProfile.Achievements
 * @type {UI-Router}
 */
Achievements.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.Achievements', {
            views: {
                'achievements@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/achievements/template.html',
                    controller: 'Athlete.EditProfile.Achievements.controller'
                }
            },

            resolve: {
                'Athlete.EditProfile.Achievements.Data': [
                    '$q', 'Athlete.EditProfile.Achievements.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

Achievements.service('Athlete.EditProfile.Achievements.Data.Dependencies', [
    'SessionService', 'ReelsFactory', 'UsersFactory',
    function(session, reels, users) {

        var userId = session.currentUser.id;

        var Data = {
            users: users.load({relatedUserId: userId}), //TO-DO: Change to users by teamId if possible
            reels: reels.load({userId: userId})
        };

        return Data;
    }

]);

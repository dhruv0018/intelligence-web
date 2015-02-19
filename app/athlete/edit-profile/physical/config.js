/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Physical page module.
 * @module EditProfile.Physical
 */
var Physical = angular.module('Athlete.EditProfile.Physical');

/**
 * EditProfile.Physical page state router.
 * @module EditProfile.Physical
 * @type {UI-Router}
 */
Physical.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.Physical', {
            views: {
                'physical@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/physical/template.html',
                    controller: 'Athlete.EditProfile.Physical.controller'
                }
            },

            resolve: {
                'Athlete.EditProfile.Physical.Data': [
                    '$q', 'Athlete.EditProfile.Physical.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

Physical.service('Athlete.EditProfile.Physical.Data.Dependencies', [
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

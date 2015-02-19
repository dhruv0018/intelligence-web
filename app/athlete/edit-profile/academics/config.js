/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Academics page module.
 * @module EditProfile.Academics
 */
var Academics = angular.module('Athlete.EditProfile.Academics');

/**
 * EditProfile.Academics page state router.
 * @module EditProfile.Academics
 * @type {UI-Router}
 */
Academics.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.Academics', {
            views: {
                'academics@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/academics/template.html',
                    controller: 'Athlete.EditProfile.Academics.controller'
                }
            },

            resolve: {
                'Athlete.EditProfile.Academics.Data': [
                    '$q', 'Athlete.EditProfile.Academics.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

Academics.service('Athlete.EditProfile.Academics.Data.Dependencies', [
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

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile.Highlights page module.
 * @module Profile.Highlights
 */
var Highlights = angular.module('Athlete.Profile.Highlights');

/**
 * Profile.Highlights page state router.
 * @module Profile.Highlights
 * @type {UI-Router}
 */
Highlights.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.Highlights', {
            views: {
                'highlights@Athlete.Profile': {
                    templateUrl: 'athlete/profile/highlights/template.html',
                    controller: 'Athlete.Profile.Highlights.controller'
                }
            },

            resolve: {
                'Athlete.Profile.Highlights.Data': [
                    '$q', 'Athlete.Profile.Highlights.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

Highlights.service('Athlete.Profile.Highlights.Data.Dependencies', [
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

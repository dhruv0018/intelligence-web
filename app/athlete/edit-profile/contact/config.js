/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Contact page module.
 * @module EditProfile.Contact
 */
var Contact = angular.module('Athlete.EditProfile.Contact');

/**
 * EditProfile.Contact page state router.
 * @module EditProfile.Contact
 * @type {UI-Router}
 */
Contact.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.Contact', {
            views: {
                'contact@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/contact/template.html',
                    controller: 'Athlete.EditProfile.Contact.controller'
                }
            },

            resolve: {
                'Athlete.EditProfile.Contact.Data': [
                    '$q', 'Athlete.EditProfile.Contact.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

Contact.service('Athlete.EditProfile.Contact.Data.Dependencies', [
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

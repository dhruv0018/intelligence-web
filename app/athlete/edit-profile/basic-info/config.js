/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.BasicInfo page module.
 * @module EditProfile.BasicInfo
 */
var BasicInfo = angular.module('Athlete.EditProfile.BasicInfo');

/**
 * EditProfile.BasicInfo page state router.
 * @module EditProfile.BasicInfo
 * @type {UI-Router}
 */
BasicInfo.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.BasicInfo', {
            views: {
                'basic-info@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/basic-info/template.html',
                    controller: 'Athlete.EditProfile.BasicInfo.controller'
                }
            },

            resolve: {
                'Athlete.EditProfile.BasicInfo.Data': [
                    '$q', 'Athlete.EditProfile.BasicInfo.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

BasicInfo.service('Athlete.EditProfile.BasicInfo.Data.Dependencies', [
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

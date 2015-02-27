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
                'content@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/physical/template.html',
                    controller: 'Athlete.EditProfile.Physical.controller'
                }
            },
            resolve: {
                'Athlete.EditProfile.Physical.Data': [
                    '$q', 'Athlete.EditProfile.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

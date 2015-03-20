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
            }
        });
    }
]);

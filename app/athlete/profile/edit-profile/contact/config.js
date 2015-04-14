/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Contact page module.
 * @module EditProfile.Contact
 */
var Contact = angular.module('Athlete.Profile.EditProfile.Contact');

/**
 * EditProfile.Contact page state router.
 * @module EditProfile.Contact
 * @type {UI-Router}
 */
Contact.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile.Contact', {
            views: {
                'content@Athlete.Profile.EditProfile': {
                    templateUrl: 'athlete/edit-profile/contact/template.html',
                    controller: 'Athlete.Profile.EditProfile.Contact.controller'
                }
            }
        });
    }
]);

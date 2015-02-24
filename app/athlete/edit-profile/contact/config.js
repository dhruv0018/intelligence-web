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
                'content@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/contact/template.html',
                    controller: 'Athlete.EditProfile.Contact.controller'
                }
            }
        });
    }
]);

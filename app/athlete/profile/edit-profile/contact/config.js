/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/contact/template.html';

/**
 * EditProfile.Contact page module.
 * @module EditProfile.Contact
 */
const Contact = angular.module('Athlete.Profile.EditProfile.Contact');

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
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.EditProfile.Contact.controller'
                }
            }
        });
    }
]);

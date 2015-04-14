/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Contact page module.
 * @module EditProfile.Contact
 */
var Contact = angular.module('Athlete.Profile.EditProfile.Contact');

/*
* EditProfile.Contact dependencies
*/
ContactController.$inject = [
    '$scope'
];

/**
 * EditProfile.Contact controller.
 * @module EditProfile.Contact
 * @name EditProfile.Contact.controller
 * @type {controller}
 */
function ContactController (
    $scope
) {
    //TODO: remove controller if unused
}

Contact.controller('Athlete.Profile.EditProfile.Contact.controller', ContactController);

export default ContactController;

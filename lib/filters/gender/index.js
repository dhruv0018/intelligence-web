const angular = window.angular;

/**
 * Gender
 * @module Gender
 */
const Gender = angular.module('Gender.Filter', []);

/**
 * Gender filter.
 * @module Gender
 * @name gameIsDeleted
 * @type {Filter}
 */

formattedConferenceGender.$inject = [];

function formattedConferenceGender () {
    return (gender) => {

        if (gender === 'Male') {
            return 'Men\'s';
        } else if (gender === 'Female') {
            return 'Women\'s';
        } else {
            return gender;
        }
    };
}

Gender.filter('formattedConferenceGender', formattedConferenceGender);

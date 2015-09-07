/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template';
import directive from './directive';

const templateUrl = 'user-fields/template.html';

/**
 * UserFields
 * @module UserFields
 */
const UserFields = angular.module('UserFields', []);

/* Cache the template file */
UserFields.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

UserFields.directive('userFields', () => new directive());

export default UserFields;

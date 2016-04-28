/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';

const templateUrl = 'association-conference/template.html';
const AssociationConference = angular.module('AssociationConference', []);
import directive from './directive';

AssociationConference.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

AssociationConference.directive('associationConference', directive);

export default AssociationConference;

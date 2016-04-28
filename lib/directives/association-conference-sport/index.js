/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';

const templateUrl = 'association-conference-sport/template.html';
const AssociationConferenceSport = angular.module('AssociationConferenceSport', []);
import directive from './directive';

AssociationConferenceSport.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

AssociationConferenceSport.directive('associationConferenceSport', directive);

export default AssociationConferenceSport;

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';

const templateUrl = 'association-competition-level/template.html';
const AssociationCompetitionLevel = angular.module('AssociationCompetitionLevel', []);
import directive from './directive';

AssociationCompetitionLevel.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

AssociationCompetitionLevel.directive('associationCompetitionLevel', directive);

export default AssociationCompetitionLevel;

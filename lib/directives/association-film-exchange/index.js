/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';

const templateUrl = 'association-film-exchange/template.html';
const AssociationFilmExchange = angular.module('AssociationFilmExchange', []);
import directive from './directive';

AssociationFilmExchange.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

AssociationFilmExchange.directive('associationFilmExchange', directive);

export default AssociationFilmExchange;

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';
import directive from './directive';

const templateUrl = 'indexer-fields/template.html';

/**
 * IndexerFields
 * @module IndexerFields
 */
const IndexerFields = angular.module('IndexerFields', []);

/* Cache the template file */
IndexerFields.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

IndexerFields.directive('indexerFields', () => new directive());

export {
    IndexerFields,
    templateUrl
};

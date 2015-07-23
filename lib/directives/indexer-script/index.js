/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';
import directive from './directive';

const templateUrl = 'indexer-script/template.html';

/**
 * IndexerScript
 * @module IndexerScript
 */
const IndexerScript = angular.module('IndexerScript', []);

/* Cache the template file */
IndexerScript.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

IndexerScript.directive('indexerScript', () => new directive());

export {
    IndexerScript,
    templateUrl
};

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';
import IndexingBlockDirective from './directive';
import tagRulesFilter from './filter';

const templateUrl = 'indexing-block/template.html';

/**
 * IndexingBlock
 * @module IndexingBlock
 */
const IndexingBlock = angular.module('IndexingBlock', []);

/* Cache the template file */
IndexingBlock.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

IndexingBlock.directive('indexingBlock', IndexingBlockDirective);
IndexingBlock.filter('tagRulesFilter', tagRulesFilter);

export default IndexingBlock;

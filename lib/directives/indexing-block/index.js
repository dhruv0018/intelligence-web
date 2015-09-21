/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';
import IndexingBlockDirective from './directive';

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

//FIXME
//Move into either PlaysList OR
//directive that wraps tag iteration in the future
IndexingBlock.filter('restrictToPeriodTags', [
    'PlaysManager',
    (playsManager) => {
        return function(tags) {
            if (playsManager.plays.length === 0) {
                let periodTags = tags.map(tag => {
                    return tag.isPeriodTag ? tag: null;
                }).filter(tag => tag);
                return periodTags;
            }
            return tags;
        };
}]);

export default IndexingBlock;

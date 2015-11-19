const angular = window.angular;

/* Module Imports */
import template from './template.html';
import directive from './directive';

const templateUrl = 'self-editor-indexing/template.html';
const SelfEditorIndexing = angular.module('SelfEditorIndexing', []);

SelfEditorIndexing.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

SelfEditorIndexing.directive('selfEditorIndexing', directive);

export default SelfEditorIndexing;

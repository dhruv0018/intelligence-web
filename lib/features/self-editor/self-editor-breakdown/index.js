const angular = window.angular;

/* Module Imports */
import template from './template.html';
import directive from './directive';

const templateUrl = 'self-editor-breakdown/template.html';
const SelfEditorBreakdown = angular.module('SelfEditorBreakdown', []);

SelfEditorBreakdown.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

SelfEditorBreakdown.directive('selfEditorBreakdown', directive);

export default SelfEditorBreakdown;

const angular = window.angular;

import template from './template.html';
import directive from './directive';

const SelfEditorIndexing = angular.module('SelfEditorIndexing', []);

SelfEditorIndexing.directive('selfEditorIndexing', directive);

export default SelfEditorIndexing;

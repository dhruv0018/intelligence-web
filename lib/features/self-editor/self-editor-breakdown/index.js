const angular = window.angular;

import template from './template.html';
import directive from './directive';

const SelfEditorBreakdown = angular.module('SelfEditorBreakdown', []);

SelfEditorBreakdown.directive('selfEditorBreakdown', directive);

export default SelfEditorBreakdown;

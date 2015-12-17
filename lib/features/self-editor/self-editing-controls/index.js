const angular = window.angular;

import template from './template.html';
import directive from './directive';

const SelfEditingControls = angular.module('SelfEditingControls', []);

SelfEditingControls.directive('selfEditingControls', directive);

export default SelfEditingControls;

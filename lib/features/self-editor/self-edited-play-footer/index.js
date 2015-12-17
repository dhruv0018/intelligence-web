const angular = window.angular;

import template from './template.html';
import directive from './directive';

const SelfEditedPlayFooter = angular.module('SelfEditedPlayFooter', []);

SelfEditedPlayFooter.directive('selfEditedPlayFooter', directive);

export default SelfEditedPlayFooter;

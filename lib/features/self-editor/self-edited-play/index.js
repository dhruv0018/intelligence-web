const angular = window.angular;

import template from './template.html';
import directive from './directive';

const SelfEditedPlay = angular.module('SelfEditedPlay', []);

SelfEditedPlay.directive('selfEditedPlay', directive);

export default SelfEditedPlay;

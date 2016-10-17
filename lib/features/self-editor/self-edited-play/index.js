const angular = window.angular;

import directive from './directive';

const SelfEditedPlay = angular.module('SelfEditedPlay', []);

SelfEditedPlay.directive('selfEditedPlay', directive);

export default SelfEditedPlay;

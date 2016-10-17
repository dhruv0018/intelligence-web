const angular = window.angular;

import directive from './directive';

const SelfEditedPlayFooter = angular.module('SelfEditedPlayFooter', []);

SelfEditedPlayFooter.directive('selfEditedPlayFooter', directive);

export default SelfEditedPlayFooter;

const angular = window.angular;

import template from './template.html';
import directive from './directive';

const ReelPills = angular.module('ReelPills', []);

ReelPills.directive('reelPills', directive);

export default ReelPills;

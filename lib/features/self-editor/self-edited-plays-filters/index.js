const angular = window.angular;

import template from './template.html';
import directive from './directive';

const SelfEditedPlaysFilters = angular.module('SelfEditedPlaysFilters', []);

SelfEditedPlaysFilters.directive('selfEditedPlaysFilters', directive);

export default SelfEditedPlaysFilters;

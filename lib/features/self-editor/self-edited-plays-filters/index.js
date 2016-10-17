const angular = window.angular;

import directive from './directive';

const SelfEditedPlaysFilters = angular.module('SelfEditedPlaysFilters', []);

SelfEditedPlaysFilters.directive('selfEditedPlaysFilters', directive);

export default SelfEditedPlaysFilters;

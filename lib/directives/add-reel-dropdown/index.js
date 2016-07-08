const angular = window.angular;

import template from './template.html';
import directive from './directive';

// Directives
import ReelPills from './reel-pills';

const AddReelDropdown = angular.module('AddReelDropdown', [
    'ReelPills'
]);

AddReelDropdown.directive('addReelDropdown', directive);

export default AddReelDropdown;

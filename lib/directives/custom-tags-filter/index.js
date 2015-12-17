import directive from './directive';
import controller from './controller';

const dependencies = [

];

const CustomTagsFilter = window.angular.module('CustomTagsFilter', dependencies);

CustomTagsFilter.directive('customTagsFilter', directive);

CustomTagsFilter.controller('CustomTagsFilter.Controller', controller);

export default CustomTagsFilter;

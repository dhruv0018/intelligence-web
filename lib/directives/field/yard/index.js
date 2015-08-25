import YardFieldDefinition from './directive';

const YardDropdown = angular.module('Field.YardDropdown', []);

YardDropdown.directive('yardDropdownField', () => new YardFieldDefinition());

export default YardDropdown;

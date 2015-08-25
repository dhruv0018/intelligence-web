import GapFieldDefinition from './directive';

const GapDropdown = angular.module('Field.GapDropdown', []);

GapDropdown.directive('gapDropdownField', () => new GapFieldDefinition());

export default GapDropdown;

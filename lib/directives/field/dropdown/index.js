import DropdownFieldDefinition from './directive';

const Dropdown = angular.module('Field.Dropdown', []);

Dropdown.directive('dropdownField', () => new DropdownFieldDefinition());

export default Dropdown;

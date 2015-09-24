import ArenaFieldDefinition from './directive';

const ArenaDropdown = angular.module('Field.Arena', []);

ArenaDropdown.directive('arenaDropdownField', () => new ArenaFieldDefinition());

export default ArenaDropdown;

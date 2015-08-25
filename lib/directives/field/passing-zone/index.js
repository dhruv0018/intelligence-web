import PassingZoneFieldDefinition from './directive';

const PassingZoneDropdown = angular.module('Field.PassingZoneDropdown', []);

PassingZoneDropdown.directive('passingZoneDropdownField', () => new PassingZoneFieldDefinition());

export default PassingZoneDropdown;

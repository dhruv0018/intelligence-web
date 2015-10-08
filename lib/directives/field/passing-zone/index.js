import PassingZoneFieldDefinition from './directive';

const PassingZone = angular.module('Field.PassingZone', []);

PassingZone.directive('passingZoneField', () => new PassingZoneFieldDefinition());

export default PassingZone;

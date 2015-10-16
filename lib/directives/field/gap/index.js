import GapFieldDefinition from './directive';

const Gap = angular.module('Field.Gap', []);

Gap.directive('gapField', () => new GapFieldDefinition());

export default Gap;

import FormationFieldDefinition from './directive';

const Formation = angular.module('Field.Formation', []);

Formation.directive('formationField', () => new FormationFieldDefinition());

export default Formation;

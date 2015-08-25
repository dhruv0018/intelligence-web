import FormationFieldDefinition from './directive';

const FormationDropdown = angular.module('Field.FormationDropdown', []);

FormationDropdown.directive('formationDropdownField', () => new FormationFieldDefinition());

export default FormationDropdown;

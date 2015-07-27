import FieldDefinition from '../definition';
import FieldController from '../controller';

var FormationDropdown = angular.module('Field.FormationDropdown', []);

class FormationFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
FormationFieldController.$inject = ['$scope'];

class FormationFieldDefinition extends FieldDefinition{
    constructor() {
        super();
        this.controller = FormationFieldController;
    }
}

let definition = new FormationFieldDefinition();

FormationDropdown.directive('formationDropdownField', () => definition);

export default FormationDropdown;

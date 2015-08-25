import FieldDefinition from '../definition';
import FieldController from '../controller';

const GapDropdown = angular.module('Field.GapDropdown', []);

class GapFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
GapFieldController.$inject = ['$scope'];

class GapFieldDefinition extends FieldDefinition {
    constructor() {
        super();
        this.controller = GapFieldController;
    }
}

let definition = new GapFieldDefinition();

GapDropdown.directive('gapDropdownField', () => definition);

export default GapDropdown;

import FieldDefinition from '../definition';
import FieldController from '../controller';

const PassingZoneDropdown = angular.module('Field.PassingZoneDropdown', []);

class PassingZoneFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
PassingZoneFieldController.$inject = ['$scope'];

class PassingZoneFieldDefinition extends FieldDefinition {
    constructor() {
        super();
        this.controller = PassingZoneFieldController;
    }
}

let definition = new PassingZoneFieldDefinition();

PassingZoneDropdown.directive('passingZoneDropdownField', () => definition);

export default PassingZoneDropdown;

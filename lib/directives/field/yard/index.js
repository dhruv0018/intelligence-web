import FieldDefinition from '../definition';
import FieldController from '../controller';

const YardDropdown = angular.module('Field.YardDropdown', []);

class YardFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
YardFieldController.$inject = ['$scope'];

class YardFieldDefinition extends FieldDefinition {
    constructor() {
        super();
        this.controller = YardFieldController;
    }
}

let definition = new YardFieldDefinition();

YardDropdown.directive('yardDropdownField', () => definition);

export default YardDropdown;

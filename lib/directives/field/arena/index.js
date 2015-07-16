import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';

var ArenaDropdown = angular.module('Field.Arena', []);

class ArenaFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
    initialize(){
        this.scope.chooseField = () => {
            console.log('working');
        };
    }
}
ArenaFieldController.$inject = ['$scope'];

class ArenaFieldDefinition extends FieldDefinition{
    constructor() {
        super();
        this.controller = ArenaFieldController;
        //does nothing
        this.link = () => {};
        this.template = FieldTemplate;
    }
}

let definition = new ArenaFieldDefinition();

ArenaDropdown.directive('arenaDropdownField', () => definition);

export default ArenaDropdown;

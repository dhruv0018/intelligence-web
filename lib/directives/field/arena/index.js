import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';

var ArenaDropdown = angular.module('Field.Arena', []);

class ArenaFieldController extends FieldController {
    constructor(scope, arenaModal) {
        super(scope);
        this.arenaModal = arenaModal;
    }
    initialize(){
        this.scope.chooseField = () => {
            console.log('working');

            this.arenaModal.show(this.scope);
        };
    }
}
ArenaFieldController.$inject = ['$scope', 'ArenaDialog.Service'];

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

import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';

var ArenaDropdown = angular.module('Field.Arena', []);

class ArenaFieldController extends FieldController {
    constructor(scope, arenaModal, dialog) {
        super(scope);
        this.scope = scope;
        this.arenaModal = arenaModal;
        this.dialog = dialog;
    }
    initialize(){
        this.scope.chooseField = () => {
            this.arenaModal.show(this.scope).then( (value) => {
                this.scope.field.currentValue = value;
                this.scope.selectedValue = value;
            });
        };
    }
}
ArenaFieldController.$inject = ['$scope', 'ArenaDialog.Service', '$mdDialog'];

class ArenaFieldDefinition extends FieldDefinition{
    constructor() {
        super();
        this.controller = ArenaFieldController;
        this.link = () => {};
        this.template = FieldTemplate;
    }
}

let definition = new ArenaFieldDefinition();

ArenaDropdown.directive('arenaDropdownField', () => definition);

export default ArenaDropdown;

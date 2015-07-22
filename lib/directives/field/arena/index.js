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
            console.log('working');
            //let alert = this.dialog.alert().title('hi').content('hiii').ok('byeee');
            //this.dialog.show(alert);
            //console.log(this.dialog);
            this.scope.dialogPromise = this.arenaModal.show(this.scope);
            //this.scope.arenaModal.show(this.scope);
            this.scope.dialogPromise.then( (value) => {
                this.scope.selectedValue = value;
            });
        };

        this.scope.closeModal = () => {
            this.dialog.hide(this.dialogPromise);
            //this.dialog.hide();
            this.dialogPromise = null;
        };
    }
}
ArenaFieldController.$inject = ['$scope', 'ArenaDialog.Service', '$mdDialog'];

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

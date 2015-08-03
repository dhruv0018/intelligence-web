import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';

var ArenaDropdown = angular.module('Field.Arena', []);

class ArenaFieldController extends FieldController {
    constructor(scope, arenaModal, dialog, uiEventEmitter, EVENT) {
        super(scope);
        this.scope = scope;
        this.arenaModal = arenaModal;
        this.dialog = dialog;
        this.uiEventEmitter = uiEventEmitter;
        this.EVENT = EVENT;
    }
    initialize(){
        this.scope.chooseField = () => {

            /* Since we have no <input> field, for a blur on previous elements */
            document.getElementsByTagName('arena-dropdown-field')[0].focus();

            this.arenaModal.show(this.scope).then( (value) => {
                this.scope.field.currentValue = value;
                this.scope.selectedValue = value;

                /* Re-emit ENTER key press after modal close and scope variable
                 * assignment because ENTER event already captured by isIndexing
                 * block before the above scope variables are set. */
                this.uiEventEmitter.emit(this.EVENT.UI.KEY_DOWN.ENTER);
            });
        };
    }
}
ArenaFieldController.$inject = ['$scope', 'ArenaDialog.Service', '$mdDialog', 'UIEventEmitter', 'EVENT'];

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

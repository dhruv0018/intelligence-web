import FieldController from '../controller';

class ArenaFieldController extends FieldController {

    constructor(scope, arenaDialog, uiEventEmitter, EVENT) {

        super(scope);

        this.scope = scope;
        this.arenaDialog = arenaDialog;
        this.uiEventEmitter = uiEventEmitter;
        this.EVENT = EVENT;

        this.initialize();
    }

    initialize () {

        this.scope.onFocus = this.onFocus.bind(this);
    }

    onFocus () {

        const arenaModalPromise = this.arenaDialog.show(this.scope);

        arenaModalPromise.then(value => {

            this.scope.field.value = value;
            this.scope.displayValue = value;

            /**
             * Re-emit ENTER key press after modal close and scope
             * variable assignment because ENTER event already
             * captured by isIndexing block before the above scope
             * variables are set.
             */
            this.uiEventEmitter.emit(this.EVENT.UI.KEY_DOWN.ENTER);
        });
    }
}

ArenaFieldController.$inject = [
    '$scope',
    'ArenaDialog.Service',
    'UIEventEmitter',
    'EVENT'
];

export default ArenaFieldController;

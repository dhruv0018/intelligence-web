import FieldController from '../controller';

/**
 * ArenaField directive controller
 * @class ArenaFieldController
 * @extends FieldController
 */
class ArenaFieldController extends FieldController {

    /**
     * Binds dependency injections to this; binds class methods to scope
     * @constructor
     * @param dependencies
     */
    constructor(
        scope,
        arenaDialog,
        uiEventEmitter,
        EVENT,
        videoPlayer
    ) {

        super(scope);
        this.arenaDialog = arenaDialog;
        this.uiEventEmitter = uiEventEmitter;
        this.EVENT = EVENT;
        this.videoPlayer = videoPlayer;

        this.scope.onFocus = this.onFocus.bind(this);
    }

    /**
     * Opens the arena dialog if not already Opens
     * @method ArenaFieldController.onFocus
     */
    onFocus () {

        if (!this.arenaDialogPromise) {

            this.openDialog();
        }
    }

    /**
     * Invokes dialog service to open dialog and set up promise/handlers
     * @method ArenaFieldController.openDialog
     */
    openDialog () {

        let indexingElement;

        if (document.fullscreenEnabled) {

            indexingElement = document.getElementsByTagName('indexing-block')[0];
        }
        else {

            indexingElement = document.getElementsByClassName('indexing')[0];
        }
        const parent = angular.element(indexingElement);

        this.arenaDialogPromise = this.arenaDialog.show(this.scope, parent);
        this.arenaDialogPromise.then(
            this.onDialogSuccess.bind(this),
            this.onDialogError.bind(this)
        );
    }

    /**
     * Callback when dialog resolves on enter keypress
     * @method ArenaFieldController.onDialogSuccess
     */
    onDialogSuccess (value) {

        this.scope.field.value = value;
        this.scope.displayValue = value;

        /**
         * Re-emit ENTER key press after modal close and scope
         * variable assignment because ENTER event already
         * captured by isIndexing block before the above scope
         * variables are set.
         */
        this.uiEventEmitter.emit(this.EVENT.UI.KEY_DOWN.ENTER);

        this.arenaDialogPromise = null;
    }

    /**
     * Callback when dialog resolves on mouseclick
     * @method ArenaFieldController.onDialogError
     */
    onDialogError (value) {

        this.arenaDialogPromise = null;
    }
}

ArenaFieldController.$inject = [
    '$scope',
    'ArenaDialog.Service',
    'UIEventEmitter',
    'EVENT',
    'VideoPlayer'
];

export default ArenaFieldController;

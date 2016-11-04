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
    constructor (
        scope,
        arenaModal,
        uiEventEmitter,
        EVENT,
        videoPlayer,
        playlistEventEmitter
    ) {

        super(scope, playlistEventEmitter, EVENT);
        this.arenaModal = arenaModal;
        this.uiEventEmitter = uiEventEmitter;
        this.EVENT = EVENT;
        this.videoPlayer = videoPlayer;

        this.scope.onFocus = this.onFocus.bind(this);
    }

    /**
     * Opens the arena modal if not already open
     * @method ArenaFieldController.onFocus
     */
    onFocus () {

        if (!this.arenaModalPromise) {

            this.openModal();
        }
    }

    /**
     * Invokes modal service to open modal and set up promise/handlers
     * @method ArenaFieldController.openModal
     */
    openModal () {

        let indexingElement;

        /* TO-DO: document.fullscreenEnabled was broken when this was written so this condition has never been called
                  Investigate in the future if it ever should be.

        if (document.fullscreenEnabled) {

            indexingElement = document.getElementsByTagName('indexing-block')[0];
        }
        else { */

        indexingElement = document.getElementsByClassName('indexing')[0];

        this.arenaModalPromise = this.arenaModal.open(this.scope.field).result;
        this.arenaModalPromise.then(
            this.onModalSuccess.bind(this),
            this.onModalError.bind(this)
        );
    }

    /**
     * Callback when modal resolves on enter keypress
     * @method ArenaFieldController.onModalSuccess
     */
    onModalSuccess (value) {

        this.scope.field.value = value;
        this.scope.displayValue = value;

        this.arenaModalPromise = null;
    }

    /**
     * Callback when modal resolves on mouseclick
     * @method ArenaFieldController.onModalError
     */
    onModalError (value) {

        this.arenaModalPromise = null;
    }
}

ArenaFieldController.$inject = [
    '$scope',
    'ArenaPopup.Modal',
    'UIEventEmitter',
    'EVENT',
    'VideoPlayer',
    'PlaylistEventEmitter'
];

export default ArenaFieldController;

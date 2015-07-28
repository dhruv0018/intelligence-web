/* Import Angular IntelligenceWebClient module */
const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

/* Import EventEmitter Node module */
const EventEmitter = require('events').EventEmitter;

/* Import EVENT types constant */
import EVENT from '../constants/event';

/* UIEvent > KeyboardEvent keycodes */
const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

/**
 * A Node EventEmitter that broadcasts HTML UIEvents
 * @class UIEventEmitter
 * @extends EventEmitter
 * @example
 * import uiEventEmitter from 'src/emitters/ui-event';
 * import EVENT from 'src/constants/event';
 * uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, event => {...});
 */
class UIEventEmitter extends EventEmitter {

    /**
     * Binds desired GlobalEventHandlers to class methods
     * @constructor
     * @returns {UIEventEmitter}
     */
    constructor () {

        super();

        window.onkeydown = event => this.onKeyDown(event);
    }

    /**
     * GlobalEventHandlers.onkeydown callback
     * @method UIEventEmitter.onKeyDown
     * @param {UIEvent} event
     */
    onKeyDown (event) {

        switch (event.keyCode) {

            case ENTER_KEY_CODE:

                this.emit(EVENT.UI.KEY_DOWN.ENTER, event);
                break;

            case ESC_KEY_CODE:

                this.emit(EVENT.UI.KEY_DOWN.ESC, event);
                break;
        }
    }
}

/* Singleton UIEventEmitter */
const uiEventEmitter = new UIEventEmitter();

/* Open singleton to Angular DI */
IntelligenceWebClient.factory('UIEventEmitter', () => uiEventEmitter);

/* Export singleton for ES6, non-Angular modules */
export default uiEventEmitter;

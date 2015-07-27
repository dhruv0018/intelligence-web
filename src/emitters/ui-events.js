import EVENT from '../constants/event';

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

class UIEventEmitter extends EventEmitter {

    constructor () {

        super();

        window.onkeydown = event => this.onKeyDown(event);
    }

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

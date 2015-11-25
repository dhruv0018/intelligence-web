/* Import Angular IntelligenceWebClient module */
const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

/* Import EventEmitter Node module */
const EventEmitter = require('events').EventEmitter;

/* Import EVENT types constant */
import EVENT from '../constants/event';

class AdminGamesEventEmitter extends EventEmitter {

    /**
     * Binds desired GlobalEventHandlers to class methods
     * @constructor
     * @returns {AdminGamesEventEmitter}
     */
    constructor () {
        super();
        this.setMaxListeners(10);
    }

    onQueryFinish (event, games) {
        console.log('firing');
        this.emit(EVENT.ADMIN.QUERY.COMPLETE, event, games);
    }
}

/* Singleton */
const adminGamesEventEmitter = new AdminGamesEventEmitter();

/* Open singleton to Angular DI */
IntelligenceWebClient.factory('AdminGamesEventEmitter', () => adminGamesEventEmitter);

/* Export singleton for ES6, non-Angular modules */
export default adminGamesEventEmitter;

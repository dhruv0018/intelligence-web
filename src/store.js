var pkg = require('../package.json');

var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

import rootReducer from './reducers';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

IntelligenceWebClient.config([
    '$ngReduxProvider',
    function config($ngReduxProvider) {
        const middlewares = [
            //thunk - async action middleware
            thunk
        ];

        /* Add logger middleware for dev env only */
        if (process.env.NODE_ENV === `development`) {
            const logger = createLogger();
            middlewares.push(logger);
        }

        $ngReduxProvider.createStoreWith(rootReducer, middlewares);
    }
]);

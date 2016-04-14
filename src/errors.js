var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * Error reporter to manage how error reporting is handled.
 * @class ErrorReporter
 */
var ErrorReporter = {

    previousError: null,

    /**
     * Delegates the error to specified services.
     * @method reportError
     * @param {Error} error - the error to handle.
     */
    reportError: function(error) {

        if (!error) return;

        /* TODO: Rate limit the number of errors generated. */
        if(this.previousError && this.previousError.name === error.name){
            //if the same error as the last one no need to report again
            return;
        }else{
            error.message = 'Error: ' + error.message + '\n';

            /* Append the stack trace to the error message if present. */
            if (error.stack) error.message += 'Stacktrace:\n' + error.stack;

            this.logToConsole(error);
            this.logToAPI(error);

            this.previousError = error;
        }

    },

    /**
     * Delegate to log the error to the browser console.
     * @method logToConsole
     * @param {Error} error - the error to handle.
     */
    logToConsole: function(error) {

        console.error(error.message);
    },

    /**
     * Delegate to log the error to the API log endpoint.
     * @method logToAPI
     * @param {Error} error - the error to handle.
     */
    logToAPI: function(error) {

        /* TODO: Implement this functionality at a later date. */
    }
};

IntelligenceWebClient.value('ErrorReporter', ErrorReporter);

/**
 * Browser error handler function. This is the default browser error handler
 * function. In HTML5 the 4th and 5th parameters are available, giving access
 * to the actual error. This is dependent on browser implementation and therefore
 * may not be available.
 * @param {String} message - error message
 * @param {String} url - location where the error originated from
 * @param {Number} line - line number of the occurrence
 * @param {Number} column - column number of the occurrence
 * @param {Error} error - actual error object
 */
window.onerror = function(message, url, line, column, error) {

    /* If no error object is present create one. */
    error = error || new Error(message + ' at ' + line + ':' + column + ' in ' + url);

    /* Handle the error. */
    ErrorReporter.reportError(error);

    /* Error has been handled, prevent default handling. */
    return true;
};

/**
 * Creates decorator hook to Angular's exception handler
 * Uses a decorator to intercept the built-in Angular exception handler. This
 * allows other actions to be performed when Angular captures an exception.
 */
IntelligenceWebClient.config([
    '$provide',
    function config($provide) {

        $provide.decorator('$exceptionHandler', function() {

            return function(exception, cause) {

                exception.message = exception.message + ' error';

                if (cause) {

                    exception.message += ' caused by ' + cause;
                }

                /* Handle the error. */
                ErrorReporter.reportError(exception);
            };
        });
    }
]);

IntelligenceWebClient.run([
    '$rootScope', '$log', '$location', '$state', 'AlertsService',
    function run($rootScope, $log, $location, $state, alerts) {

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

            event.preventDefault();

            $log.warn('State not found; coming from "' + fromState.name + '" looking for "' + unfoundState.name + '"');

            alerts.add({
                type: 'info',
                message: unfoundState.name + ' page not found'
            });
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

            if (!event.defaultPrevented) {

                $log.error('State change error; going from "' + fromState.name + '" to "' + toState.name + '"');

                ErrorReporter.reportError(error);

                alerts.add({
                    type: 'warning',
                    message: 'Could not go to ' + toState.name
                });
            }
        });

        $rootScope.$on('roleChangeError', function(event, role) {

            if (!event.defaultPrevented) {

                role = role || {};
                role.type = role.type || {};
                role.type.name = role.type.name || 'Unknown Role';

                alerts.add({
                    type: 'warning',
                    message: 'Could not change role to "' + role.type.name + '"'
                });
            }
        });
    }
]);

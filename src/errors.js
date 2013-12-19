var IntelligenceWebClient = require('./app');

/**
 * Error reporter to manage how error reporting is handled.
 * @class ErrorReporter
 */
var ErrorReporter = {

    /**
     * Delegates the error to specified services.
     * @method reportError
     * @param {Error} error - the error to handle.
     */
    reportError: function(error) {

        /* TODO: Check if this is the same error as the last one;
         * in which case we don't need to report it again. */

        /* TODO: Rate limit the number of errors generated. */

        error.message = 'Error: ' + error.message + '\n';

        /* Append the stack trace to the error message if present. */
        if (error.stack) error.message += 'Stacktrace:\n' + error.stack;

        this.logToConsole(error);
        this.logToAPI(error);
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

                exception.message = exception.message + ' error' + ' caused by ' + cause;

                /* Handle the error. */
                ErrorReporter.reportError(exception);
            };
        });
    }
]);

/**
 * Intercepts HTTP responses.
 */
IntelligenceWebClient.factory('HttpInterceptor', [
    '$q', '$location',
    function factory($q, $location) {

        return {

            /* Intercept all responses. Includes any server responses that are
            * considered successful. Which are status codes up to the 400 level. */
            response: function(response) {
            /* jshint camelcase:false */

                /* Catch errors in 200 responses. */
                if (response.data.error) {

                    if (response.data.error === 'invalid_token') {

                        ErrorReporter.reportError(new Error('Invalid access token'));

                        /* TODO: Don't go to login; refresh token. */
                        $location.path('/login');
                    }

                    else {

                        ErrorReporter.reportError(new Error('Error response\n' +
                            response.data.error + ': ' +
                            response.data.error_description));
                    }

                    return $q.reject(response);
                }

                return response;
            },

            /* Intercept responses with status codes that indicate errors. */
            responseError: function(response) {

                switch (response.status) {

                case 401: /* Unauthorized */
                case 403: /* Forbidden */
                    ErrorReporter.reportError(new Error('Unauthorized'));
                    $location.path('/login');
                    break;

                case 500: /* Server Error */
                    ErrorReporter.reportError(new Error('Server error', response.data));
                    $location.path('/500').replace();
                    break;

                case 501: /* Not Implemented */
                    $location.path('/501').replace();
                    break;

                default:
                    ErrorReporter.reportError(new Error('Error response', response.data));
                    break;
                }

                return $q.reject(response);
            }
        };
    }
]);

IntelligenceWebClient.config(function($httpProvider) {

    $httpProvider.interceptors.push('HttpInterceptor');
});

IntelligenceWebClient.run([
    '$rootScope', '$location', '$state',
    function run($rootScope, $location, $state) {

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

            event.preventDefault();
            $state.go('404');
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

            ErrorReporter.reportError(error);
            $state.go('error');
        });

        $rootScope.$on('roleChangeError', function(event, role) {

            role = role || {};
            role.type = role.type || {};
            role.type.name = role.type.name || 'Unknown Role';

            var error = new Error('Could not change role to "' + role.type.name + '"');

            ErrorReporter.reportError(error);

            $state.go('error');
        });
    }
]);


var IntelligenceWebClient = require('./app');

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

};

/**
 * Creates decorator hook to Angular's exception handler
 * Uses a decorator to intercept the built-in Angular exception handler. This
 * allows other actions to be performed when Angular captures an exception.
 * Afterwards; the exception is passed back to Angular for handling.
 */
IntelligenceWebClient.config([
    '$provide',
    function config($provide) {

        $provide.decorator('$exceptionHandler', function($delegate) {

            return function(exception, cause) {

                exception.message = exception.message + ' caused by ' + cause;

                /* Pass along exception to default Angular handler.
                 * The default implementation simply delegates to
                 * $log.error which logs it into the browser console. */
                $delegate(exception, cause);
            };
        });
    }
]);


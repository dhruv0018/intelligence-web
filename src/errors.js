var IntelligenceWebClient = require('./app');

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


var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * Creates decorator hook to Angular's log handler
 * Uses a decorator to intercept the built-in Angular log handler. This
 * allows other actions to be performed when Angular logs.
 */
IntelligenceWebClient.config([
    '$provide',
    function config($provide) {

        $provide.decorator('$log', [
            '$delegate',
            function($delegate) {

                var decorate = function(method, decoratee) {

                    return function() {

                        var args = Array.prototype.slice.call(arguments);

                        decoratee.apply(null, args);
                    };
                };

                ['log', 'debug', 'info', 'warn', 'error'].forEach(function(method) {

                    $delegate[method] = decorate(method, $delegate[method]);
                });

                return $delegate;
            }
        ]);
    }
]);


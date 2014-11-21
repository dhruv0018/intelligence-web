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
            '$delegate', '$window',
            function($delegate, $window) {
                $delegate.decorated = false;

                var decorate = function(method, decoratee) {

                    return function() {

                        var args = Array.prototype.slice.call(arguments);

                        //mapping track to every method for now until we can
                        //figure out why console[method] isnt working
                        $window.trackJs.track.apply(null, args);

                        //calls the appropriate tracking method -- not working ATM
                        //$window.trackJs.console[method].apply(null, args);

                        decoratee.apply(null, args);
                    };
                };


                //async decoration
                $delegate.initDecoration = function() {
                    ['log', 'debug', 'info', 'warn', 'error'].forEach(function(method) {
                        $delegate[method] = decorate(method, $delegate[method]);
                    });
                    $delegate.decorated = true;
                };

                return $delegate;
            }
        ]);
    }
]);


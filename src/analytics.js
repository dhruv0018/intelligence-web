(function() {

    // Create a queue, but don't obliterate an existing one!
    window.analytics = window.analytics || [];

    // Add a version to keep track of what's in the wild.
    window.analytics.SNIPPET_VERSION = '2.0.9';

    // A list of the methods in Analytics.js to stub.
    window.analytics.methods = [
        'identify', 'group', 'track', 'page', 'pageview', 'alias',
        'ready', 'on', 'once', 'off', 'trackLink', 'trackForm',
        'trackClick', 'trackSubmit'
    ];

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    window.analytics.factory = function(method) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            window.analytics.push(args);
            return window.analytics;
        };
    };

    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < window.analytics.methods.length; i++) {
        var key = window.analytics.methods[i];
        window.analytics[key] = window.analytics.factory(key);
    }
})();

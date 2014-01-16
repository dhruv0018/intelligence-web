var ONE_SECOND = 1000; // Number of milliseconds in a second.

var IntelligenceWebClient = require('./app');

IntelligenceWebClient.config([
    'config', 'flowFactoryProvider',
    function (config, flowFactoryProvider) {

        flowFactoryProvider.defaults = {

            target: config.kvs.uri + 'upload/part/',
            maxChunkRetries: 100,
            chunkRetryInterval: ONE_SECOND * 2
        };
    }
]);

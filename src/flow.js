var ONE_SECOND = 1000; // Number of milliseconds in a second.

var IntelligenceWebClient = require('./app');

IntelligenceWebClient.config([
    'config', 'flowFactoryProvider',
    function (config, flow) {

        flow.defaults = {

            maxChunkRetries: 100,
            chunkRetryInterval: ONE_SECOND * 2
        };

        flow.factory = function(options) {

            Flow.FlowChunk.prototype.getParams = function () {

                return {

                    chunkNumber: this.offset + 1,
                    chunkSize: this.flowObj.opts.chunkSize,
                    currentChunkSize: this.endByte - this.startByte,
                    totalSize: this.fileObjSize,
                    identifier: this.fileObj.uniqueIdentifier,
                    filename: this.fileObj.name,
                    relativePath: this.fileObj.relativePath,
                    totalChunks: this.fileObj.chunks.length
                };
            };

            return new Flow(options);
        };
    }
]);

var ONE_SECOND = 1000; // Number of milliseconds in a second.

var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var Flow = require('flowjs');

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.config([
    'flowFactoryProvider',
    function(flow) {

        flow.defaults = {

            withCredentials: true,
            permanentErrors: [404, 415, 501],
            maxChunkRetries: 100,
            chunkRetryInterval: ONE_SECOND * 2
        };

        flow.factory = function(options) {

            Flow.FlowChunk.prototype.getParams = function() {

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

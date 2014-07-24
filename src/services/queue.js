var RETRY_INTERVAL = 10000;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * A service to manage HTTP activity. Provides queues for each request type and
 * prioritizes them. Requests added and will be sent in order of their method
 * priority and then the order in which they were added.
 * @module IntelligenceWebClient
 * @name HTTPQueueService
 * @type {Service}
 */
IntelligenceWebClient.service('HTTPQueueService', [
    '$q', '$injector', '$interval',
    function($q, $injector, $interval) {

        var $http;

        var online = true;
        var offline = false;
        var network = true;
        var running = false;
        var interval = null;

        var queues = {

            get: [],
            put: [],
            post: [],
            delete: [],
            default: []
        };

        var priorities = [
            'post',
            'put',
            'get',
            'delete',
            'default'
        ];

        /**
         * Checks network availability.
         * @returns true if the network is available; false otherwise.
         */
        this.isNetworkAvailable = function() {

            return network;
        };

        /**
         * Determines if the queue has pending requests.
         * @returns true if there are pending requests; false otherwise.
         */
        this.hasPendingRequests = function() {

            return running;
        };

        /**
         * Runs the queue. Starts running the queue and processing requests on a
         * set interval.
         */
        this.run = function() {

            running = true;
            network = false;

            /* On each interval. */
            var onInterval = function() {

                if (online) {

                    this.dequeque();
                }
            };

            /* Start intervals at the set constant. */
            interval = $interval(onInterval.bind(this), RETRY_INTERVAL);
        };

        /**
         * Stops the queue from processing requests.
         */
        this.stop = function() {

            $interval.cancel(interval);

            running = false;
        };

        /**
         * Enqueues a request. Places the given request in the queue for
         * processing later. The request will be grouped by method. Newly queued
         * requests are placed in the back of the queue and will be processed
         * after the currently queued requests.
         * @param {Object} request - the request to process.
         * @returns {Promise} - a promise of the request.
         */
        this.enqueue = function(request) {

            /* Don't queue cached requests. */
            if (request.cache) return request;

            /* Convert responses to requests. */
            if (request.config) request = request.config;

            /* Record a deferred for the request. */
            request.deferred = $q.defer();

            /* Determine the request method. */
            var method = request.method.toLowerCase();

            /* If a queue does not exist for the method, use the default. */
            if (!queues[method]) method = 'default';

            /* Add the request to the appropriate method queue. */
            queues[method].push(request);

            /* If the queue is not running, start running it. */
            if (!running) { this.run(); }

            /* Return promise of the request. */
            return request.deferred.promise;
        };

        /**
         * Enqueues a request. Places the given request in the queue for
         * processing later. The request will be grouped by method. Newly queued
         * requests are placed in the back of the queue and will be processed
         * after the currently queued requests.
         */
        this.dequeque = function() {

            /**
             * Determines if the given queue has pending requests.
             * @param {String} queue - method name of the queue
             * @return {Boolean} - true if the queue has pending requests.
             */
            var pending = function(queue) {

                return !!queues[queue].length;
            };

            /**
             * Based on priorities, check each queue for pending requests. If
             * the first queue found has a pending request then retry it. If the
             * network is available keep moving through the queues. Continuing
             * until there are no more pending requests in any of the queues, at
             * which point the dequequeing is considered finished.
             */
            var finished = priorities.every(function(queue) {

                /* If there are pending requests in the queue. */
                if (pending(queue)) {

                    /* Remove the first request from the queue. */
                    var request = queues[queue].shift();

                    /* Retry the request. */
                    retry(request);

                    /* If the network is available, continue; if the network is
                     * not available, then stop. */
                    return network;
                }

                /* If there are no more pending requests, then dequequeing is
                 * finished. */
                return !pending(queue);
            });

            if (finished) {

                this.stop();
            }
        };

        /**
         * Retry a request. Retries the given request.
         * @param {Object} request - the request to process.
         */
        var retry = function(request) {

            $http = $http || $injector.get('$http');

            /* Include request retry in the promise chain of the deferred request. */
            request.deferred.promise.then(null, null, function() {

                /* Recreate the request. */
                return $http(request)

                /* On a successful request, consider the network reachable and
                 * resolve the promise of the original request. */
                .success(function() {

                    network = true;
                    request.deferred.resolve(request);
                })

                /* On an unsuccessful request, consider the network unreachable and
                 * reject the promise of the original request. */
                .error(function() {

                    network = false;
                    request.deferred.reject(request);
                });
            });

            /* Notify the promise of the original request. */
            request.deferred.notify();

            /* Return promise of the request. */
            return request.deferred.promise;
        };

        /**
         * Go online.
         */
        var goOnline = function() {

            online = true;
            offline = false;

            this.run();
        };

        /**
         * Go offline.
         */
        var goOffline = function() {

            online = false;
            offline = true;

            this.stop();
        };

        /* Listen for online and offline events. */
        window.addEventListener('online', goOnline.bind(this));
        window.addEventListener('offline', goOffline.bind(this));
    }
]);


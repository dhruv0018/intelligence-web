var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * @module IntelligenceWebClient
 * @name TagsManager
 * @type {service}
 */
IntelligenceWebClient.service('TagsManager', [
    'IndexingService',
    function service(indexing) {

        this.current = indexing.getStartTags();

        this.reset = function() {

            this.current = indexing.getStartTags();
        };

        this.clear = function() {

            this.current = [];
        };
    }
]);


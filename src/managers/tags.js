var IntelligenceWebClient = require('../app');

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


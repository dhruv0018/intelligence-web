/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * @module Indexing
 * @name TagsService
 * @type {service}
 */
Indexing.service('Indexing.TagsService', [
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


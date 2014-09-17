var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name TagsManager
 * @type {service}
 */
IntelligenceWebClient.service('TagsManager', [
    function service() {

        this.tagset = null;

        this.current = [];

        this.reset = function(tagset) {

            this.tagset = tagset || this.tagset;

            this.current = this.tagset.getStartTags();
        };

        this.clear = function() {

            this.current = [];
        };

        this.nextTags = function(tagId) {

            this.current = this.tagset.getNextTags(tagId);
        };
    }
]);


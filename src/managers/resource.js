var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * A service to manage the active resources in the session. Keeps track of any
 * resources being edited in the session. Enables reseting all of the resources.
 * @module IntelligenceWebClient
 * @name ActiveResourceService
 * @type {service}
 */
IntelligenceWebClient.service('ResourceManager', [
    function() {

        /* List of resources actively being used. */
        this.active = [];

        /**
         * Backups up a given resource.
         * @param {Resource} resource - a resource.
         */
        this.backup = function(resource) {

            var backup = angular.copy(resource);

            /* Keep a backup of the resource. */
            this.active.push(backup);

            /* Keep track of the resource backup. */
            resource.storage.backupIndex = this.active.indexOf(backup);
        };

        /**
         * Resets a given resource. Consider the given resource no longer active.
         * @param {Resource} resource - a resource.
         */
        this.reset = function(resource) {

            /* Remove the backup copy of the resource. */
            this.active.splice(resource.storage.backupIndex, 1);

            /* Remove reference to the backup. */
            delete resource.storage.backupIndex;
        };

        /**
         * Replaces the resource in its collection with a given resource. Also
         * updates the list copy of the collection.
         * @param {Resource} resource - a resource.
         */
        this.replace = function(resource) {

            if (resource === resource.storage.collection[resource.id]) return;

            angular.copy(resource, resource.storage.collection[resource.id]);

            resource.updateList();
        };

        /**
         * Restores all of the managed resources. Will replace all of the
         * managed resources with their backups.
         */
        this.restore = function() {

            var self = this;

            self.active.forEach(function(resource) {

                self.replace(resource);
            });

            /* Clear the active resource list. */
            self.active = [];
        };
    }
]);


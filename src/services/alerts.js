var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * A service for alert notifications displayed to the user.
 *
 * Alerts are in the format:
 *
 * alert: {
 *      type: ['info'|'success'|'danger'],
 *      message: '{String}'
 * }
 *
 * Both alert.type and alert.message are required.
 *
 * @module IntelligenceWebClient
 * @name AlertsService
 * @type {service}
 */
IntelligenceWebClient.service('AlertsService', [
    function() {

        /* List of active alerts. */
        this.alerts = [];

        /**
         * Adds a new alert.
         * @param {Object} alert - an alert object.
         */
        this.add = function(alert) {

            if (!alert.type) throw new Error('No alert type');
            if (!alert.message) throw new Error('No alert message');

            this.alerts.push(alert);
        };

        /**
         * Removes an alert.
         * @param {Integer} index - the index of the alert to remove.
         */
        this.remove = function(index) {

            this.alerts.splice(index, 1);
        };

        /**
         * Clears all alerts.
         */
        this.clear = function() {

            this.alerts.length = 0;
        };
    }
]);


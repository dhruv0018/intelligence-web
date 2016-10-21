const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service saving and restoring the previous Admin search filters when navigating
 * to and from the Info pages.
 *
 * @module IntelligenceWebClient
 * @name AdminSearchService
 * @type {service}
 */
IntelligenceWebClient.service('AdminSearchService', [
    function () {
        this.users = {
            filter: {},
            clear: function () {
                this.filter = {};
            }
        };
        this.teams = {
            //TODO potential candiate for changing filter to true instead of 1 if the backend begins to support it
            filter: {
                isCustomerTeam: 1
            },
            clear: function () {
                this.filter = {
                    isCustomerTeam: 1
                };
            }
        };
        this.schools = {
            filter: {},
            clear: function () {
                this.filter = {};
            }
        };
        this.conferences = {
            filter: {},
            clear: function () {
                this.filter = {};
            }
        };
    }
]);

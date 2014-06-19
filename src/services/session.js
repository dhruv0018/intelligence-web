var CURRENT_USER_KEY = 'CURRENT_USER';

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * A service to manage the current user in the session. It handles both storing
 * and retrieving a user. The user is stored in memory and the browser session
 * and optionally can also be stored in the browser's persistent storage.
 * @module IntelligenceWebClient
 * @name SessionService
 * @type {service}
 */
IntelligenceWebClient.service('SessionService', [
    'UsersResource', 'UsersFactory',
    function(UsersResource, users) {

        /* Memory storage for current user. */
        this.currentUser = null;

        /**
         * Converts a user resource object to an encoded string representing it.
         * @param {Object} user - a user resource object.
         */
        this.serializeUser = function(user) {

            delete user.description;
            delete user.resource;
            delete user.storage;

            return JSON.stringify(angular.toJson(user));
        };

        /**
         * Converts a string to a user resource object.
         * @param {String} string - a string representing a user object that has
         * been encoded with the serializeUser method.
         */
        this.deserializeUser = function(string) {

            var storedObject = angular.fromJson(JSON.parse(string));
            var user = new UsersResource(storedObject);

            return users.extend(user);
        };

        /**
         * Stores the current user. Will store the user in memory, the session,
         * and optionally persistently.
         * @param {Object} user - a user resource object.
         * @param {Boolean} persist - if true the user will be persisted.
         */
        this.storeCurrentUser = function(user, persist) {

            user = user || this.currentUser;
            persist = persist || user.persist;

            /* Store the persistence flag on the user for use later. */
            user.persist = persist;

            /* Store user in memory. */
            if (!this.currentUser) this.currentUser = user;
            else if (!angular.equals(this.currentUser, user)) angular.copy(user, this.currentUser);

            /* Store user in the session. */
            sessionStorage.setItem(CURRENT_USER_KEY, this.serializeUser(user));

            /* If the persistence flag is set, store the user in the browser. */
            if (persist) {

                localStorage.setItem(CURRENT_USER_KEY, this.serializeUser(user));
            }
        };

        /**
         * Checks if the user is currently stored in any way.
         * @returns {Boolean} true if the user is stored; false otherwise.
         */
        this.isCurrentUserStored = function() {

            return !!this.currentUser ||
                   !!sessionStorage[CURRENT_USER_KEY] ||
                   !!localStorage[CURRENT_USER_KEY];
        };

        /**
         * Clears the user from all storage.
         */
        this.clearCurrentUser = function() {

            this.currentUser = null;
            sessionStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);
        };

        /**
         * Retrieves the current user. Will first check if the user is stored in
         * memory, then checks the session, then looks in the browser.
         */
        this.retrieveCurrentUser = function() {

            /* Retrieve user from memory. */
            if (this.currentUser) {

                return this.currentUser;
            }

            /* Retrieve user from session. */
            else if (sessionStorage[CURRENT_USER_KEY]) {

                return this.deserializeUser(sessionStorage[CURRENT_USER_KEY]);
            }

            /* Retrieve user from browser. */
            else if (localStorage[CURRENT_USER_KEY]) {

                return this.deserializeUser(localStorage[CURRENT_USER_KEY]);
            }
        };
    }
]);


var CURRENT_USER_KEY = 'CURRENT_USER';
var PREVIOUS_USER_KEY = 'PREVIOUS_USER';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to manage the current user in the session. It handles both storing
 * and retrieving a user. The user is stored in memory and the browser session
 * and optionally can also be stored in the browser's persistent storage.
 * @module IntelligenceWebClient
 * @name SessionService
 * @type {service}
 */
IntelligenceWebClient.service('SessionService', [
    'TransformDates', 'UsersResource', 'UsersFactory',
    function(dates, User, users) {

        /* Memory storage for current user. */
        this.currentUser = null;

        /* Memory storage for previous user. */
        this.previousUser = null;

        /**
         * Converts a user resource object to an encoded string representing it.
         * @param {Object} user - a user resource object.
         */
        this.serializeUser = function(user) {

            return angular.toJson(user);
        };

        /**
         * Converts a string to a user resource object.
         * @param {String} string - a string representing a user object that has
         * been encoded with the serializeUser method.
         */
        this.deserializeUser = function(string) {

            var userResourceObject = angular.fromJson(string);

            userResourceObject = dates.transformToDates(userResourceObject);

            var user = new User(userResourceObject);
            user = users.extend(user);

            return user;
        };

        /**
         * Stores the current user. Will store the user in memory, the session,
         * and optionally persistently.
         * @param {String} key - a key.
         * @param {Object} user - a user resource object.
         * @param {Boolean} persist - if true the user will be persisted.
         */
        this.storeUser = function(key, user, persist) {

            persist = persist || user.persist;

            /* Store the persistence flag on the user for use later. */
            user.persist = persist;

            /* Store user in the session. */
            sessionStorage.setItem(key, this.serializeUser(user));

            /* If the persistence flag is set, store the user in the browser. */
            if (persist) {

                localStorage.setItem(key, this.serializeUser(user));
            }
        };

        /**
         * Stores the current user. Will store the user in memory, the session,
         * and optionally persistently.
         * @param {Object} user - a user resource object.
         * @param {Boolean} persist - if true the user will be persisted.
         */
        this.storeCurrentUser = function(user, persist) {

            user = user || this.currentUser;

            /* Store user in memory. */
            this.currentUser = user;

            /* Store user in the session. */
            this.storeUser(CURRENT_USER_KEY, user, persist);
        };

        /**
         * Stores the previous user. Will store the user in memory, the session,
         * and optionally persistently.
         * @param {Object} user - a user resource object.
         * @param {Boolean} persist - if true the user will be persisted.
         */
        this.storePreviousUser = function(user, persist) {

            if (!user) return;

            /* Store user in memory. */
            this.previousUser = user;

            /* Store user in the session. */
            this.storeUser(PREVIOUS_USER_KEY, user, persist);
        };

        /**
         * Checks if the user is currently stored in any way.
         * @param {String} key - a key.
         * @returns {Boolean} true if the user is stored; false otherwise.
         */
        this.isUserStored = function(key) {

            return !!sessionStorage[key] || !!localStorage[key];
        };

        /**
         * Checks if the current user is currently stored in any way.
         * @returns {Boolean} true if the user is stored; false otherwise.
         */
        this.isCurrentUserStored = function() {

            return !!this.currentUser || this.isUserStored(CURRENT_USER_KEY);
        };

        /**
         * Checks if the previous user is currently stored in any way.
         * @returns {Boolean} true if the user is stored; false otherwise.
         */
        this.isPreviousUserStored = function() {

            return !!this.previousUser || this.isUserStored(PREVIOUS_USER_KEY);
        };

        /**
         * Clears the user from all storage.
         * @param {String} key - a key.
         */
        this.clearUser = function(key) {

            sessionStorage.removeItem(key);
            localStorage.removeItem(key);
        };

        /**
         * Clears the current user from all storage.
         */
        this.clearCurrentUser = function() {

            this.currentUser = null;
            this.clearUser(CURRENT_USER_KEY);
        };

        /**
         * Clears the previous user from all storage.
         */
        this.clearPreviousUser = function() {

            this.previousUser = null;
            this.clearUser(PREVIOUS_USER_KEY);
        };

        /**
         * Retrieves the user. Will first check if the user is stored in
         * memory, then checks the session, then looks in the browser.
         * @param {String} key - a key.
         */
        this.retrieveUser = function(key) {

            /* Retrieve user from session. */
            if (sessionStorage[key]) {

                return this.deserializeUser(sessionStorage[key]);
            }

            /* Retrieve user from browser. */
            else if (localStorage[key]) {

                return this.deserializeUser(localStorage[key]);
            }
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

            else return this.retrieveUser(CURRENT_USER_KEY);
        };

        /**
         * Retrieves the previous user. Will first check if the user is stored in
         * memory, then checks the session, then looks in the browser.
         */
        this.retrievePreviousUser = function() {

            /* Retrieve user from memory. */
            if (this.previousUser) {

                return this.previousUser;
            }

            else return this.retrieveUser(PREVIOUS_USER_KEY);
        };
    }
]);


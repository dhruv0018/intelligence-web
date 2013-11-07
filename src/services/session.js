var CURRENT_USER_KEY = 'CURRENT_USER';

var IntelligenceWebClient = require('../app');

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
            return users.extendUser(user);
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
            this.currentUser = user;

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
         * memory, then checks the session, then looks in the browser. If the
         * user cannot be found in storage, then retrieves it from the server.
         * @param {String} userId - a unique identifier for the user.
         * @callback {function(user)} callback - returns the current user.
         */
        this.retrieveCurrentUser = function(userId, callback) {

            var self = this;

            var user;

            callback = callback || function(user) {

                return user;
            };

            /* Retrieve user from memory. */
            if (this.currentUser) {

                user = this.currentUser;
                self.storeCurrentUser(user);
                return user;
            }

            /* Retrieve user from session. */
            else if (sessionStorage[CURRENT_USER_KEY]) {

                user = self.deserializeUser(sessionStorage[CURRENT_USER_KEY]);
                self.storeCurrentUser(user);
                return user;
            }

            /* Retrieve user from browser. */
            else if (localStorage[CURRENT_USER_KEY]) {

                user = self.deserializeUser(localStorage[CURRENT_USER_KEY]);
                self.storeCurrentUser(user);
                return user;
            }

            /* Retrieve user from server. */
            else if (userId) {

                users.get(userId, function(user) {

                    self.storeCurrentUser(user);
                    return callback(user);
                });
            }

            /* No stored user could be found and not enough information provided
             * to retrieve one, so throw an error. */
            else {

                throw new Error('Could not retrieve user');
            }
        };
    }
]);


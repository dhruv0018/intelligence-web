var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('UsersFactory', [
    '$rootScope', 'UsersResource', 'ROLE_TYPE',
    function($rootScope, UsersResource, ROLE_TYPE) {

        var UsersFactory = {

            resource: UsersResource,

            list: [],

            extendUser: function(user) {

                var self = this;

                /* Remove the user password from the model. If set it will
                 * be sent in a resource call. So only set it if the intent
                 * is to change the password. */
                delete user.password;

                /* Convert the last accessed string to a date object. */
                user.lastAccessed = new Date(user.lastAccessed);

                /* If the date conversion failed clear the value. */
                if (isNaN(user.lastAccessed.valueOf())) user.lastAccessed = '';

                /* Copy all of the properties from the retrieved $resource
                 * "user" object. */
                angular.extend(user, self);

                /* If the user only has one role, then use it for
                 * their current one. */
                if (user.roles && user.roles.length === 1)
                    user.currentRole = user.roles[0];

                /* Get the users default role, in any. */
                var defaultRole = user.getDefaultRole();

                /* If the user has a default role defined, then use it
                 * for their default and current one. */
                if (defaultRole) {
                    user.defaultRole = defaultRole;
                    user.currentRole = defaultRole;
                }

                return user;
            },

            get: function(userId, callback) {

                var self = this;

                self.resource.get({ id: userId }, function(user) {

                    user = self.extendUser(user);

                    callback(user);
                });
            },

            getAll: function() {

                var self = this;

                self.list = self.resource.query(function() {

                    for (var i = 0; i < self.list.length; i++) {

                        self.list[i] = self.extendUser(self.list[i]);
                    }
                });

                return self.list;
            },

            save: function(user) {

                var self = this;

                user = user || self;

                delete user.list;

                /* User ID's are assigned server side, if it is present that means
                * the user is present on the server, so update them (PUT).
                * If not present then this a new user so create them (POST). */
                if (user.id) user.$update();

                else {

                    var newUser = new UsersResource(user);
                    newUser.$create();
                }
            },

            /**
            * @class User
            * @method
            * @returns {String} returns the users first and last name as a
            * concatenated string.
            * Gets the users full name.
            */
            get name() {

                return this.firstName + ' ' + this.lastName;
            },

            /**
             * @class User
             * @method
             * @param {Object} role - a role object to add
             * Adds the given role to the user.
             */
            addRole: function(role) {

                this.roles.unshift(role);
                this.save();
            },

            /**
             * @class User
             * @method
             * @param {Object} role - a role object to be removed
             * Removes the given role from the user.
             */
            removeRole: function(role) {

                this.roles.splice(this.roles.indexOf(role), 1);
                this.save();
            },

            /**
            * @class User
            * @method
            * @returns {Object} the default role object for the user. If no
            * default is defined, it will return `undefined`.
            * Gets the users default role.
            */
            getDefaultRole: function() {

                var roles = this.roles;

                if (!roles) return undefined;

                for (var i = 0; i < roles.length; i++) {

                    if (roles[i].isDefault === true) {

                        return roles[i];
                    }
                }

                return undefined;
            },

            /**
            * @class User
            * @method
            * @param {Object} newDefaultRole - the role object to set the users
            * default role to.
            * Sets the users default role.
            */
            setDefaultRole: function(newDefaultRole) {

                this.currentRole = newDefaultRole;

                var roles = this.roles;

                for (var i = 0; i < roles.length; i++) {

                    roles[i].isDefault = (newDefaultRole.id === roles[i].id);
                }

                this.save();
            },

            /**
             * @class User
             * @method
             * @param {Object} role - the role object to check for the match.
             * @param {Object} match - the role object to match.
             * @returns {Boolean} true if a match is found; false otherwise.
             * Checks if the given role matches the role given as match.
             * If only one parameter is given, its assumed to be match.
             * If role is omitted then it will default to this users current.
             */
            is: function(role, match) {

                if (!match) {

                    match = role;
                    role = this.currentRole;
                }

                role = role || this.currentRole;

                if (!role) return false;
                if (!match) throw new Error('No role to match specified');

                var found = false;
                var roleIds = role.type.id;
                var matchIds = match.type.id;

                /* Treat IDs as arrays. */
                if (!Array.isArray(roleIds)) roleIds = [roleIds];
                if (!Array.isArray(matchIds)) matchIds = [matchIds];

                /* Loop through Id arrays looking for a match. */
                roleIds.some(function(roleId) {

                    matchIds.some(function(matchId) {

                        found = roleId == matchId;
                        return found;
                    });

                    return found;
                });

                return found;
            },

            /**
             * @class User
             * @method
             * @param {Object} match - the role object to match.
             * @returns {Boolean} true if a match is found; false otherwise.
             * Checks if any of the users roles for a match to the role given.
             */
            has: function(match) {

                var self = this;
                var found = false;
                var roles = self.roles;

                if (!roles) return false;
                if (!match) throw new Error('No role to match specified');

                /* Check all roles for match. */
                roles.some(function(role) {

                    found = self.is(role, match);
                    return found;
                });

                return found;
            }
        };

        return UsersFactory;
    }
]);


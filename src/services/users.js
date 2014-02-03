var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('UsersFactory', [
    '$rootScope', 'UsersResource', 'ROLE_TYPE', 'ROLES',
    function($rootScope, UsersResource, ROLE_TYPE, ROLES) {

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

            getList: function(filter, success, error) {

                var self = this;
                filter = filter || {};

                if(!filter.start){
                    filter.start = 0;
                }
                if(!filter.count){
                    filter.count = 1000;
                }

                error = error || function() {

                    throw new Error('Could not load users list');
                };

                return self.resource.query(filter, function(users){
                    for(var i = 0; i < users.length; i++){
                        users[i] = self.extendUser(users[i]);
                    }
                    return success ? success(users) : users;
                }, error);


            },

            save: function(user) {

                var self = this;

                user = user || self;

                delete user.list;

                /* User ID's are assigned server side, if it is present that means
                * the user is present on the server, so update them (PUT).
                * If not present then this a new user so create them (POST). */
                if (user.id) {
                    
                    var updateUser = new UsersResource(user);
                    return updateUser.$update();

                } else {

                    var newUser = new UsersResource(user);

                    newUser.password = 'password';

                    return newUser.$create();
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
             * @param {Object} user - the user to add the role to
             * @param {Object} role - a role object to add
             * Adds the given role to the given user. If no user is specified,
             * this user will be used.
             */
            addRole: function(user, role) {

                if (!role) {

                    role = user;
                    user = this;
                }

                role.userId = user.id;

                user.roles = user.roles || [];
                user.roles.unshift(role);
            },

            /**
             * @class User
             * @method
             * @param {Object} user - the user to remove the role from
             * @param {Object} role - a role object to be removed
             * Removes the given role from the user. If no user is specified,
             * this user will be used.
             */
            removeRole: function(user, role) {

                if (!role) {

                    role = user;
                    user = this;
                }

                if (user.roles) user.roles.splice(user.roles.indexOf(role), 1);
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

                    roles[i].isDefault = angular.equals(roles[i], newDefaultRole);
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

                var roleIds = role.type.id;
                var matchIds = match.type.id;

                /* Treat IDs as arrays. */
                if (!Array.isArray(roleIds)) roleIds = [roleIds];
                if (!Array.isArray(matchIds)) matchIds = [matchIds];

                /* Loop through Id arrays looking for a match. */
                return roleIds.some(function(roleId) {

                    return matchIds.some(function(matchId) {

                        return roleId == matchId;
                    });
                });
            },

            /**
             * @class User
             * @method
             * @returns {Boolean} true if user has no roles; false otherwise.
             * Checks if the user has any roles.
             */
            hasNoRoles: function() {
                var self = this;
                var roles = self.roles;
                
                if (!roles || roles.length < 1 ){
                    return true;
                } else {
                    return false;
                }
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
                var roles = self.roles;

                if (!roles) return false;
                if (!match) throw new Error('No role to match specified');

                /* Check all roles for match. */
                return roles.some(function(role) {

                    return self.is(role, match);
                });
            },

            /**
             * @class User
             * @method
             * @param {Object} role - a role object to use as accessing role.
             * @param {Object} verify - a role object to verify access to.
             * @returns {Boolean} true if role has access to verify; false otherwise.
             * Verifies that the given role has access to the requested role.
             */
            hasAccess:function(role, verify) {

                if (!verify) {

                    verify = role;
                    role = this.currentRole;
                }

                /* Dictate what Super Admins can access. */
                if (this.is(role, ROLES.SUPER_ADMIN)) {

                    /* Super Admins can access every role, except other Supers. */
                    return this.is(verify, ROLES.SUPER_ADMIN) ? false : true;
                }

                /* Dictate what Admins can access. */
                else if (this.is(role, ROLES.ADMIN)) {

                    /* Admins can not access Super Admins or other Admins,
                     * but can access all other roles. */
                    return this.is(verify, ROLES.SUPER_ADMIN) ||
                           this.is(verify, ROLES.ADMIN) ? false : true;
                }

                /* Dictate what a Head Coach can access. */
                else if (this.is(role, ROLES.HEAD_COACH)) {

                    /* A Head Coach can access Assistant Coaches and Athletes. */
                    return this.is(verify, ROLES.ASSISTANT_COACH) ||
                           this.is(verify, ROLES.ATHLETE) ? true : false;
                }

                /* TODO: These rules are meant to be updated when new
                 * requirements come in. They represent the known access rules. */

                /* Assume all other roles do not have access. */
                return false;
            }
        };

        return UsersFactory;
    }
]);

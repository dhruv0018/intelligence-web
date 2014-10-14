var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('UsersFactory', [
    '$injector', '$rootScope', 'BaseFactory', 'ROLE_ID', 'ROLE_TYPE', 'ROLES', 'ResourceManager',
    function($injector, $rootScope, BaseFactory, ROLE_ID, ROLE_TYPE, ROLES, managedResources) {

        var UsersFactory = {

            PAGE_SIZE: 2500,

            description: 'users',

            model: 'UsersResource',

            storage: 'UsersStorage',

            extend: function(user) {
                var self = this;


                user.roleTypes = {};
                Object.keys(ROLE_TYPE).forEach(function(roleType) {
                    user.roleTypes[ROLE_TYPE[roleType]] = [];
                });

                /* Remove the user password from the model. If set it will
                 * be sent in a resource call. So only set it if the intent
                 * is to change the password. */
                delete user.password;
                /* If the user has roles. */
                if (user.roles) {
                    /* For each role. */
                    user.roles.forEach(function(role) {
                        /* Default the tenureEnd to null. */
                        role.tenureEnd = role.tenureEnd || null;

                        //TODO hotfixed, to be properly fixed later
                        if (!role.type.id) {
                            role.type = {
                                id: role.type
                            };
                        }

                        if (!role.type.name) {
                            role.type.name = ROLES[ROLE_ID[role.type.id]].type.name;
                        }

                        //active roles only
                        if (!role.tenureEnd) {
                            user.roleTypes[role.type.id].push(role);
                        }
                    });
                }

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

            unextend: function(user) {

                var self = this;

                /* Create a copy of the resource to break reference to original. */
                var copy = angular.copy(user);

                delete copy.defaultRole;
                delete copy.currentRole;

                angular.forEach(copy.roles, function(role) {
                    role.type = (role.type.id) ? role.type.id : role.type;
                });

                return copy;
            },

            search: function(query) {

                var self = this;

                return self.retrieve(query).then(function(users) {

                    var teamIds = [];

                    angular.forEach(users, function(user) {

                        angular.forEach(user.roles, function(role) {

                            if (role.teamId && teamIds.indexOf(role.teamId) < 0) {

                                teamIds.push(role.teamId);
                            }
                        });
                    });

                    if (teamIds.length) {

                        var teams = $injector.get('TeamsFactory');

                        return teams.retrieve({ 'id[]': teamIds }).then(function() {

                            return users;
                        });
                    }

                    else return users;
                });
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
             * @param {Object} team - a team object to draw the teamId from
             * Adds the given role to the given user. If no user is specified,
             * this user will be used.
             */
            addRole: function(user, role, team) {

                var self = this;

                if (!role) {

                    role = user;
                    user = self;
                }

                role = angular.copy(role);
                role.userId = user.id;
                role.tenureEnd = null;
                role.tenureStart = new Date();

                if (team) {
                    role.teamId = team.id;
                }

                user.roles = user.roles || [];
                user.roles.unshift(role);

                if (!user.roleTypes) {
                     user.roleTypes = {};
                }

                user.roleTypes[role.type.id].push(role);
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

                var self = this;

                if (!role) {

                    role = user;
                    user = self;
                }

                /* If the user has no roles. */
                if (!user.roles) return;

                /* Find the index of the role in the users roles. */
                var userRoleIndex = user.roles.indexOf(role);

                /* If the role was not found in the users roles. */
                if (!~userRoleIndex) return;

                /* If the tenure end of the role has alread been set. */
                if (user.roles[userRoleIndex].tenureEnd) return;

                /* Record the tenure end date of the role. */
                user.roles[userRoleIndex].tenureEnd = new Date();
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
            },

            /**
            * @class User
            * @method
            * @returns {Array} an array on team ISs associated with the
            * user.
            */
            getTeamIds: function() {

                var roles = this.roles;

                var teamIds = [];

                roles.forEach(function(role) {

                    if (role.teamId) {

                        teamIds.push(role.teamId);
                    }
                });

                return teamIds;
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
                if (!role.type || !match.type) return false;
                if (role.tenureEnd) return false;

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

                if (!roles || roles.length < 1) {
                    return true;
                } else {
                    return false;
                }
            },

            /**
             * @class User
             * @method
             * @param {Object} matches - the role object(s) to match.
             * @returns {Boolean} true if a match is found; false otherwise.
             * Checks if any of the users roles for a match to the role given.
             */
            has: function(matches) {

                var self = this;
                var roles = self.roles;

                if (!roles) return false;
                if (!matches) throw new Error('No role to match specified');

                /* Treat matches as arrays. */
                if (!Array.isArray(matches)) matches = [matches];

                /* Loop through match arrays looking for a match. */
                return matches.some(function(match) {

                    /* Check all roles for match. */
                    return roles.some(function(role) {

                        return self.is(role, match);
                    });
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
            hasAccess: function(role, verify) {

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

                    /* Admins can not access Super Admins,
                     * but can access all other roles. */
                    return this.is(verify, ROLES.SUPER_ADMIN) ? false : true;
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
            },
            getLastAccessed: function(user) {
                return new Date(user.lastAccessed);
            },
            /**
             * @class User
             * @method
             * Resend invitation to user based on their unique identifier (email or id)
             */
            resendEmail: function(type, params, identifier) {
                var self = this;

                var model = $injector.get(self.model);
                var unique = identifier || self.id;

                return model.resendEmail({
                    unique: unique,
                    type: type,
                    params: params
                }).$promise;
            },
            /**
             * @class User
             * @method
             * @param {Object} role - the role object to check for the match.
             * @param {Object} team - the team object which is used to check if a role is associated with a team
             * @returns {Array} Array of users that fulfill the criteria of matching the role and team
             */
            findByRole: function(role, team) {
                var self = this;
                var storage = $injector.get(self.storage);

                if (!role) {
                    throw new Error('failed to pass in role');
                }

                var vettedUsers = [];

                var users = self.getList();

                users.forEach(function(user) {
                    if (user.has(role)) {
                        vettedUsers.push(user);
                    }
                });

                if (team) {
                   vettedUsers = vettedUsers.filter(function(user) {
                       var vettedRoles = user.roleTypes[role.type.id].filter(function(role) {
                         return role.teamId === team.id;
                       });

                       return vettedRoles.length > 0;
                   });
                }

                return vettedUsers;
            },
            passwordReset: function(token, password) {
                var self = this;

                var model = $injector.get(self.model);

                return model.resetPassword(
                    {token: token},
                    {password: password}
                ).$promise;
            },
            /**
             * @class User
             * @method activeRoles
             * @param {Object} optional role object
             * @returns {Array} Array of roles
             */
            activeRoles: function(role) {
                var self = this;

                var activeRoles = [];

                if (!self.roles) {
                    return [];
                }

                activeRoles = self.roles.filter(function(temporaryRole) {
                    return (!temporaryRole.tenureEnd) ? true : false;
                });

                if (role) {
                    activeRoles = activeRoles.filter(function(temporaryRole) {
                        return temporaryRole.type.id === role.type.id;
                    });
                }

                return activeRoles;
            },
            /**
             * @class User
             * @method inactiveRoles
             * @param {Object} optional role object
             * @returns {Array} Array of roles
             */
            inactiveRoles: function(role) {
                var self = this;

                var inactiveRoles = [];

                if (!self.roles) {
                    return [];
                }

                inactiveRoles = self.roles.filter(function(temporaryRole) {
                    return (temporaryRole.tenureEnd) ? false : true;
                });

                if (role) {
                    inactiveRoles = inactiveRoles.filter(function(temporaryRole) {
                        return temporaryRole.type.id === role.type.id;
                    });
                }

                return inactiveRoles;

            },
            isActive: function(role) {
                var self = this;
                return self.activeRoles(role).length >= 1;
            }
        };

        angular.augment(UsersFactory, BaseFactory);

        return UsersFactory;
    }
]);


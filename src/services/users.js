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
            * @returns {Object} the default role object for the user. If no
            * default is defined, it will return `undefined`.
            * Gets the users default role.
            */
            getDefaultRole: function() {

                var roles = this.roles;

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

                console.log(newDefaultRole);

                var roles = this.roles;

                for (var i = 0; i < roles.length; i++) {

                    roles[i].isDefault = (newDefaultRole.id === roles[i].id);
                }
            },

            isAdmin: function(role) {

                if (!role) return false;
                return role.type.id == ROLE_TYPE.ADMIN;
            },

            isSuperAdmin: function(role) {

                if (!role) return false;
                return role.type.id == ROLE_TYPE.SUPER_ADMIN;
            }
        };

        return UsersFactory;
    }
]);


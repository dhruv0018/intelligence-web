var ADMIN = '2';
var SUPER_ADMIN = '1';

var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('Users', [
    '$resource',
    function($resource) {

        var Users = $resource(

            'https://www.dev.krossover.com/intelligence-api/v1/users/:id',
            {
                id: '@id'

            }, {
                update: { method: 'PUT' }
            }
        );

        /**
         * Sets the users default role.
         */
        Users.prototype.setDefaultRole = function(newDefaultRole) {

            var roles = this.roles;

            for (var i = 0; i < roles.length; i++) {

                roles[i].isDefault = (newDefaultRole.id === roles[i].id);
            }

            this.$update();
        };

        /**
         * Gets the users default role.
         */
        Users.prototype.getDefaultRole = function() {

            var roles = this.roles;

            for (var i = 0; i < roles.length; i++) {

                if (roles[i].isDefault === '1') {

                    return roles[i];
                }
            }

            return undefined;
        };

        Object.defineProperty(Users.prototype, 'defaultRole', {

            get: function defaultRole() {

                return this.getDefaultRole();
            },

            set: function defaultRole(newDefaultRole) {

                this.setDefaultRole(newDefaultRole);
            }
        });

        Object.defineProperty(Users.prototype, 'name', {

            get: function name() {

                return this.firstName + ' ' + this.lastName;
            }
        });

        Object.defineProperty(Users.prototype, 'isAdmin', {

            get: function isAdmin() {

                return this.hasRoleId(ADMIN);
            }
        });

        Object.defineProperty(Users.prototype, 'isSuperAdmin', {

            get: function isSuperAdmin() {

                return this.hasRoleId(SUPER_ADMIN);
            }
        });

        Users.prototype.hasRoleId = function(id) {

            var roles = this.roles;

            for (var i = 0; i < roles.length; i++) {

                if (roles[i].type.id === id) {

                    return true;
                }
            }

            return false;
        };

        return Users;
    }
]);


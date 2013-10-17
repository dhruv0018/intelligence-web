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

        return Users;
    }
]);


var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('Users', [
    '$resource',
    function($resource) {

        var Users = $resource(

            'https://www.dev.krossover.com/intelligence-api/v1/users/:id', {

            id: '@id'

        });

        /**
         * Gets the users default role.
         */
        Users.prototype.getDefaultRole = function() {

            if (this.defaultRole) {

                return this.defaultRole;
            }

            for (var role in this.roles) {

                if (role.isDefault) {

                    this.defaultRole = role;
                    return this.defaultRole;
                }
            }

            return undefined;
        };

        return Users;
    }
]);


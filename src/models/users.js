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

            var roles = this.roles;

            for (var i in this.roles) {

                if (roles[i].isDefault) {

                    return roles[i];
                }
            }

            return undefined;
        };

        return Users;
    }
]);


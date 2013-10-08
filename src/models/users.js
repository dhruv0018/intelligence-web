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

            for (var i in roles) {

                roles[i].isDefault = (newDefaultRole.id === roles[i].id);
            }

            this.$update();
        };

        return Users;
    }
]);


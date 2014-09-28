var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('UsersStorage', [
    'BaseStorage',
    function(BaseStorage) {

        var description = 'users';

        var UsersStorage = Object.create(BaseStorage, {

            resource: {

                enumerable: false,

                get: function() {

                    this.role[description] = this.role[description] || Object.create(null);

                    return this.role[description];
                },

                set: function(value) {

                    this.role[description] = this.role[description] || Object.create(null);

                    this.role[description] = value;
                }
            }
        });

        return UsersStorage;
    }
]);


var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('BaseStorage', [
    '$injector',
    function($injector) {

        var session;

        var BaseStorage = Object.create({}, {

            root: {

                value: Object.create(null)
            },

            user: {

                enumerable: false,

                get: function() {

                    session = session || $injector.get('SessionService');

                    var user = session.currentUser;

                    this.root[user.id] = this.root[user.id] || Object.create(null);

                    return this.root[user.id];
                },

                set: function(value) {

                    session = session || $injector.get('SessionService');

                    var user = session.currentUser;

                    this.root[user.id] = this.root[user.id] || Object.create(null);

                    this.root[user.id] = value;
                }
            },

            role: {

                enumerable: false,

                get: function() {

                    session = session || $injector.get('SessionService');

                    var key = session.serializeRole();

                    this.user[key] = this.user[key] || Object.create(null);

                    return this.user[key];
                },

                set: function(value) {

                    session = session || $injector.get('SessionService');

                    var key = session.serializeRole();

                    this.user[key] = this.user[key] || Object.create(null);

                    this.user[key] = value;
                }
            }
        });

        return BaseStorage;
    }
]);


var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('LeaguesFactory', [
    'LeaguesResource',
    function(LeaguesResource) {

        var LeaguesFactory = {

            resource: LeaguesResource,

            get: function(id, success, error) {

                var self = this;

                var callback = function(league) {

                    return success ? success(league) : league;
                };

                error = error || function() {

                    throw new Error('Could not get league');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || 1000;

                var callback = function(leagues) {

                    var indexedLeagues = {};

                    leagues.forEach(function(league) {

                        indexedLeagues[league.id] = league;
                    });

                    leagues = index ? indexedLeagues : leagues;

                    return success ? success(leagues) : leagues;
                };

                error = error || function() {

                    throw new Error('Could not load leagues list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(league) {
                var self = this;
                league = league || self;

                if (league.id) {
                    var updateLeague = new LeaguesResource(league);
                    return updateLeague.$update();
                } else {
                    var newLeague = new LeaguesResource(league);
                    return newLeague.$create();
                }
            }
        };

        return LeaguesFactory;
    }
]);


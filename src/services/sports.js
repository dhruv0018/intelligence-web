var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SportsFactory', [
    'SportsResource',
    function(SportsResource) {

        var SportsFactory = {

            resource: SportsResource,

            get: function(sportId, success, error) {

                var self = this;

                var callback = function(sport) {

                    return success ? success(sport) : sport;
                };

                error = error || function() {

                    throw new Error('Could not get sport');
                };

                return self.resource.get({ id: sportId }, success, error);
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

                var callback = function(sports) {

                    return success ? success(sports) : sports;
                };

                error = error || function() {

                    throw new Error('Could not load sports list');
                };

                return self.resource.query(filter, function(results){
                    return success ? success(results) : results;
                }, error);
            },

            save: function(sport) {

                var self = this;

                sport = sport || self;

                if (sport.id) {
                    var updateSport = new SportsResource(sport);
                    return updateSport.$update();

                } else {

                    var newSport = new SportsResource(sport);
                    return newSport.$create();
                }
            }
        };

        return SportsFactory;
    }
]);


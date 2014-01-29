var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SportsFactory', [
    'SportsResource',
    function(SportsResource) {

        var SportsFactory = {

            resource: SportsResource,

            getList: function(filter, success, error) {

                var self = this;
                filter = filter || {};
                error = error || function() {
                    throw new Error('Could not load leagues list');
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


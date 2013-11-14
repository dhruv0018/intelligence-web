var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SportsFactory', [
    'SportsResource',
    function(SportsResource) {

        var SportsFactory = {

            resource: SportsResource,

            getList: function() {

                var self = this;
                return self.resource.query();
            },
            
            save: function(sport) {

                var self = this;

                sport = sport || self;

                if (sport.id) {

                    sport.$update();

                } else {

                    var newSport = new SportsResource(sport);
                    newSport.$create();
                }
            }
        };

        return SportsFactory;
    }
]);


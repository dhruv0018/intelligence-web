var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SportsFactory', [
    'SportsResource',
    function(SportsResource) {

        var SportsFactory = {

            resource: SportsResource,

            getList: function() {

                var self = this;
                list = self.resource.query();
                return list ? list : [];
            },
            
            save: function(sport) {

                var self = this;

                sport = sport || self;

                delete sport.teams;

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


var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('LeaguesFactory', [
    'LeaguesResource',
    function(LeaguesResource) {
        var LeaguesFactory = {
            resource: LeaguesResource,
            get: function(id, callback) {
                var self = this;
                self.resource.get({ id: id }, function(league){
                    return callback(league);
                });
            },
            getList: function() {
                var self = this;
                list = self.resource.query();
                
                return list ? list : [];
            },
            save: function(league) {
                var self = this;
                league = league || self;

                if (league.id) {
                    league.$update();
                } else {
                    var newLeague = new LeaguesResource(league);
                    newLeague.$create();
                }
            }
        };

        return LeaguesFactory;
    }
]);


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
            save: function(league) {
                var self = this;
                league = league || self;

                if (league.id) {
                    return league.$update();
                } else {
                    var newLeague = new LeaguesResource(league);
                    return newLeague.$create();
                }
            },
            getList: function(filter, success, error) {

                var self = this;
                filter = filter || {};
                error = error || function() {
                    throw new Error('Could not load leagues list');
                };

                return self.resource.query(filter, function(leagues){
                    return success ? success(leagues) : leagues;
                }, error);
            },
        };

        return LeaguesFactory;
    }
]);


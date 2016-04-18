var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FilmExchangeFactory', ['$injector', 'BaseFactory',
    function($injector, BaseFactory) {

        var FilmExchangeFactory = {

            description: 'film exchange',

            model: 'FilmExchangeResource',

            storage: 'FilmExchangeStorage',

            getTeams: function(conference) {
                let self = this;
                let model = $injector.get(self.model);
                let key = conference.id;
                let start = conference.start;
                let count = conference.count;

                return model.getTeams({
                    id: key,
                    start: start,
                    count: count
                }).$promise;
            },
            suspendTeam: function(conferenceId, teamId) {
                let self = this;
                let model = $injector.get(self.model);
                let conference = conferenceId.split('+');
                let data = {
                    'sportsAssociation': conference[0],
                    'conference': conference[1],
                    'gender': conference[2],
                    'sportId': conference[3],
                    'teamId': teamId,
                    'comments': 'Test FE Suspension'
                };

                return model.postSuspendTeam(data).$promise;
            },
            unsuspendTeam: function(conferenceId, teamId) {
                let self = this;
                let model = $injector.get(self.model);

                var key = conferenceId + '+' + teamId;

                return model.deleteSuspendedTeam({
                    id: key
                }).$promise;
            },
            getSuspendedTeams: function(conferenceId) {
                let self = this;
                let model = $injector.get(self.model);

                return model.getSuspendedTeams({id: conferenceId}).$promise;
            }
        };
        angular.augment(FilmExchangeFactory, BaseFactory);

        return FilmExchangeFactory;
    }
]);

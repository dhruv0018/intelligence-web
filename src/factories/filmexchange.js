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
                let mascot = conference.mascot;
                let teamName = conference.teamName;

                return model.getTeams({
                    id: key,
                    start: start,
                    count: count,
                    mascot: mascot,
                    teamName: teamName
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
            },
            getFilms: function(filter) {
                let self = this;
                let model = $injector.get(self.model);
                if(filter.page && filter.count){
                    filter.start = (filter.page-1) * filter.count;
                }
                if(filter.datePlayed && filter.datePlayed instanceof Date){
                    filter.datePlayed = (filter.datePlayed.toISOString()).slice(0,10);
                }

                return model.getFilms(filter).$promise;
            },
            getAllConferences: function(filter){
                let self = this;
                let model = $injector.get(self.model);

                return model.getAllConferences(filter).$promise;
            },
            getCompetitionLevel: function(conference){
                let self = this;
                let model = $injector.get(self.model);

                return model.getCompetitionLevel({id: conference.id}).$promise;
            },
            shareGameWithFilmExchange: function(game) {
                const model = $injector.get(this.model);
                let filmExchangeId = game.sportsAssociation+'+'+game.conference+'+'+game.gender+'+'+game.sportId;
                return model.shareGameWithFilmExchange({id: filmExchangeId}, game);
            }
        };
        angular.augment(FilmExchangeFactory, BaseFactory);

        return FilmExchangeFactory;
    }
]);

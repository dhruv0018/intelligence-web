var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FilmExchangeFactory', ['$injector', 'BaseFactory', 'Video', '$filter',
    function($injector, BaseFactory, Video, $filter) {

        var FilmExchangeFactory = {

            description: 'film exchange',

            model: 'FilmExchangeResource',

            storage: 'FilmExchangeStorage',

            getTeams: function(filter) {
                let self = this;
                let model = $injector.get(self.model);

                return model.getTeams(filter).$promise;
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
                if(filter.datePlayedTmp && filter.datePlayedTmp instanceof Date){
                    filter.datePlayedTmp = (filter.datePlayedTmp.toISOString()).slice(0,10);
                }
                // return model.getFilms(filter).$promise;
                return model.getFilms(filter).$promise.then(films => {
                    return films.map(film => {
                        film.datePlayed = $filter('date')(film.datePlayed, 'MMMM dd, yyyy');
                        return film;
                    });
                });
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
                return model.shareGameWithFilmExchange({id: filmExchangeId}, game).$promise;
            },
            removeGameFromFilmExchange: function(filmExchangeId, idFilmExchangeFilm) {
                const model = $injector.get(this.model);
                return model.removeGameFromFilmExchange({id: filmExchangeId, idFilmExchangeFilm}).$promise;
            },
            setVideoEntity: function(game) {
                game.video = game.video ? new Video(game.video) : null;
                return game;
            },
            getFilmExchangeAdmins: function(filmExchangeId) {
                const model = $injector.get(this.model);
                return model.getFilmExchangeAdmins({id: filmExchangeId}).$promise;
            }
        };
        angular.augment(FilmExchangeFactory, BaseFactory);

        return FilmExchangeFactory;
    }
]);

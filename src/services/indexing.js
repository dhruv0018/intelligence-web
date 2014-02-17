var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('IndexingService', [
    '$q', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'TagsetsFactory', 'PlaysFactory',
    function($q, leagues, teams, games, tagsets, PlaysFactory) {

        var HOME = 0;
        var AWAY = 1;

        var IndexingService = {

            HOME: HOME,
            AWAY: AWAY,

            teams: [],
            colors: [],
            scores: [],


            init: function(gameId) {

                var self = this;
                var promises = [];
                var deferred = $q.defer();

                /* FIXME: Just temp */
                self.period = {

                    name: 'Quarter',
                    value: 1
                };

                self.scores[HOME] = 0;
                self.scores[AWAY] = 0;

                self.game = games.get(gameId, function(game) {

                    self.colors[HOME] = game.primaryJerseyColor;
                    self.colors[AWAY] = game.opposingPrimaryJerseyColor;

                    self.teams[AWAY] = teams.get(game.opposingTeamId);
                    self.teams[HOME] = teams.get(game.teamId, function(team) {

                        self.league = leagues.get(team.leagueId, function(league) {

                            self.tagset = tagsets.get(league.tagSetId, function(tagset) {

                                tagset.getList(function(tags) {

                                    self.indexedTags = tags;

                                    deferred.resolve(self);

                                }, null, true);
                            });
                        });
                    });

                });

                return deferred.promise;
            },

            getFirstTags: function() {

                var tags = [];
                var tagset = this.tagset;

                tags.push.apply(tags, tagset.getTagsByType('START'));
                tags.push.apply(tags, tagset.getTagsByType('STANDALONE'));

                return tags;
            }
        };

        return IndexingService;
    }
]);

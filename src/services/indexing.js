var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('IndexingService', [
    '$q', '$sce', 'VIDEO_STATUSES', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'TagsetsFactory', 'PlaysFactory', 'PlayersFactory',
    function($q, $sce, VIDEO_STATUSES, leagues, teams, games, tagsets, plays, players) {

        var VARIABLE_PATTERN = /(__\d?__)/;

        var IndexingService = {

            self: null,

            init: function(gameId) {

                self = this;
                var promises = [];
                var deferred = $q.defer();
                var promisedTags = $q.defer();
                var promisedOpposingTeam = $q.defer();
                var promisedPlayers = $q.defer();

                self.game = games.get(gameId, function(game) {

                    self.team = teams.get(game.teamId, function(team) {

                        self.league = leagues.get(team.leagueId, function(league) {

                            self.tagset = tagsets.get(league.tagSetId, function(tagset) {

                                self.tags = tagset.getIndexedTags();

                                promisedTags.resolve();
                            });
                        });
                    });

                    self.opposingTeam = teams.get(game.opposingTeamId, function() {

                        promisedOpposingTeam.resolve();
                    });

                    var teamRoster = game.getRoster(game.teamId);
                    var teamPlayers = players.getList({ roster: teamRoster.id }, function() {

                        var opposingTeamRoster = game.getRoster(game.opposingTeamId);
                        var opposingTeamPlayers = players.getList({ roster: opposingTeamRoster.id }, function() {

                            var players = teamPlayers.concat(opposingTeamPlayers);

                            var indexedPlayers = {};

                            players.forEach(function(player) {

                                indexedPlayers[player.id] = player;
                            });

                            self.players = indexedPlayers;

                            promisedPlayers.resolve();
                        });
                    });

                    self.plays = plays.getList(gameId);

                    self.game.video.sources = [];

                    if (self.game.video.status === VIDEO_STATUSES.COMPLETE.id) {

                        self.game.video.videoTranscodeProfiles.forEach(function(profile) {

                            if (profile.status === VIDEO_STATUSES.COMPLETE.id) {

                                var source = {
                                    type: 'video/mp4',
                                    src: $sce.trustAsResourceUrl(profile.videoUrl)
                                };

                                self.game.video.sources.push(source);
                            }
                        });
                    }
                });

                promises.push(promisedTags.promise);
                promises.push(promisedOpposingTeam.promise);
                promises.push(promisedPlayers.promise);

                $q.all(promises).then(function() {

                    deferred.resolve(self);
                });

                return deferred.promise;
            },

            getStartTags: function() {

                return this.tagset.getStartTags();
            },

            getNextTags: function(tagId) {

                var tags = this.tags;
                var tag = tags[tagId];

                if (tag.children) {

                    return tag.children.map(function(childId) {

                        return tags[childId];
                    });

                } else {

                    return this.getStartTags();
                }
            },

            isEndTag: function(tagId) {

                return this.tags[tagId].isEnd;
            },

            isEndEvent: function(event) {

                return event && event.tag && this.isEndTag(event.tag.id);
            },

            buildScript: function(event) {

                if (!event || !event.tag || !event.tag.id) return [];

                var tagId = event.tag.id;
                var tag = self.tags[tagId];

                /* If the tag has variables. */
                if (tag.tagVariables) {

                    /* Parse the variable options. */
                    tag.tagVariables.forEach(function(variable, index) {

                        variable.index = index + 1;
                        variable.options = angular.isString(variable.options) ? JSON.parse(variable.options) : variable.options;
                    });

                    /* Split up script into array items and replace variables
                     * with the actual variable object. */
                    var variableIndex = 0;
                    var scriptItems = tag.indexerScript.split(VARIABLE_PATTERN);
                    scriptItems.forEach(function(item, index) {

                        if (item.search(VARIABLE_PATTERN) !== -1) {

                            scriptItems[index] = tag.tagVariables[variableIndex];
                            variableIndex++;
                        }
                    });

                    return scriptItems;
                }
            }
        };

        return IndexingService;
    }
]);

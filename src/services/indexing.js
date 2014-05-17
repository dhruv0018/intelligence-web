var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('IndexingService', [
    '$q', '$sce', 'TAG_VARIABLE_TYPE', 'VIDEO_STATUSES', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'TagsetsFactory', 'PlaysFactory', 'PlayersFactory',
    function($q, $sce, TAG_VARIABLE_TYPE, VIDEO_STATUSES, leagues, teams, games, tagsets, plays, players) {

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

                self.period = 1;

                self.game = games.get(gameId, function(game) {

                    self.team = teams.get(game.teamId, function(team) {

                        self.league = leagues.get(team.leagueId, function(league) {

                            tagsets.getList().$promise.then(function() {

                                self.tagset = tagsets.collection[league.tagSetId];
                                self.tags = self.tagset.getIndexedTags();
                                promisedTags.resolve();
                            });
                        });
                    });

                    self.opposingTeam = teams.get(game.opposingTeamId, function() {

                        promisedOpposingTeam.resolve();
                    });

                    self.teamRoster = game.getRoster(game.teamId);
                    players.getList({ roster: self.teamRoster.id }, function(teamPlayers) {

                        var indexedTeamPlayers = {};

                        teamPlayers.forEach(function(player) {

                            indexedTeamPlayers[player.id] = player;
                        });

                        self.teamPlayers = indexedTeamPlayers;

                        self.opposingTeamRoster = game.getRoster(game.opposingTeamId);
                        players.getList({ roster: self.opposingTeamRoster.id }, function(opposingTeamPlayers) {

                            var indexedOpposingTeamPlayers = {};

                            opposingTeamPlayers.forEach(function(player) {

                                indexedOpposingTeamPlayers[player.id] = player;
                            });

                            self.opposingTeamPlayers = indexedOpposingTeamPlayers;

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
            },

            calculateScore: function(calculatedPlay) {
                var plays = this.plays;
                var game = this.game;
                
                /* initialize scores */
                var scores = {};
                scores[game.teamId] = 0;
                scores[game.opposingTeamId] = 0;

                for (var i = 0; i < plays.length; i++) {
                    var play = plays[i];
                    
                    var events = play.events;
                    for (j = 0; j < events.length; j++) {
                        var event = events[j];
                        var teamId = this.getScoreTeam(event);
                        if (teamId) {
                            scores[teamId] += parseInt(event.tag.pointsAssigned, 10);
                        }
                    }

                    if (angular.equals(play, calculatedPlay)) { break; } // stop when we hit the passed in play
                }
                return scores;
            },

            getScoreTeam: function(event) {
                var tag = event.tag;
                var game = this.game;
                var teamId = null;
                var values = [];

                angular.forEach(event.variableValues, function(item, key) {
                    values.push(item);
                });


                if (tag.pointsAssigned && values) {
                    var value = values[0];
                    var valueTeam = this.getValueTeam(value);

                    if (tag.assignThisTeam) {
                        teamId = valueTeam;
                    } else {
                        teamId = (valueTeam === game.teamId) ? game.opposingTeamId : game.teamId;
                    }
                }
                
                return teamId;
            },

            getValueTeam: function(variableValue) {
                var game = this.game;
                var teamPlayers = this.teamPlayers;
                variableValue = variableValue || '';
                var teamId = null;

                if (variableValue.type === TAG_VARIABLE_TYPE.TEAM_DROPDOWN) {
                    teamId = variableValue.value;
                } else if (variableValue.type === TAG_VARIABLE_TYPE.PLAYER_DROPDOWN) {
                    teamId = (teamPlayers[variableValue.value]) ? game.teamId : game.opposingTeamId;
                }
                
                return teamId;
            }
        };

        return IndexingService;
    }
]);

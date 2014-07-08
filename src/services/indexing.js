var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('IndexingService', [
    '$q', '$sce', 'TAG_VARIABLE_TYPE', 'VIDEO_STATUSES', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'TagsetsFactory', 'PlaysFactory', 'PlayersFactory',
    function($q, $sce, TAG_VARIABLE_TYPE, VIDEO_STATUSES, leagues, teams, games, tagsets, plays, players) {

        var IndexingService = {

            period: 1,

            plays: [],

            reset: function(game) {

                this.game = game;
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

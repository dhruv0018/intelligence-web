var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('ScriptsService', [
    '$q', '$sce', 'TAG_VARIABLE_TYPE', 'VIDEO_STATUSES', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'TagsetsFactory', 'PlaysFactory', 'PlayersFactory',
    function($q, $sce, TAG_VARIABLE_TYPE, VIDEO_STATUSES, leagues, teams, games, tagsets, plays, players) {

        var VARIABLE_PATTERN = /(__\d?__)/;

        var ScriptsService = {

            userScript: function(tagset, event) {

                return this.buildScript('userScript', tagset, event);
            },

            indexerScript: function(tagset, event) {

                return this.buildScript('indexerScript', tagset, event);
            },

            buildScript: function(scriptType, tagset, event) {

                if (tagset && event && event.tag && event.tag.id) {

                    var tagId = event.tag.id;
                    var tags = tagset.getIndexedTags();

                    if (tags) {

                        var tag = tags[tagId];

                        if (tag && tag.tagVariables) {

                            var script = tag[scriptType];

                            /* Mark the index of each variable. */
                            tag.tagVariables.forEach(function(variable, index) {

                                variable.index = index + 1;


                                /** TODO: Move this to the DROPDOWN item
                                 * directive. */
                                variable.options = angular.isString(variable.options) ? JSON.parse(variable.options) : variable.options;
                            });

                            /* Split up script into array items and replace variables
                             * with the actual variable object. */
                            var variableIndex = 0;

                            return script.split(VARIABLE_PATTERN)

                            .filter(function(item) {

                                return item !== '';
                            })

                            .map(function(item) {

                                if (item.search(VARIABLE_PATTERN) !== -1) {

                                    return tag.tagVariables[variableIndex++];
                                }

                                else return item;
                            });
                        }
                    }
                }

                return [];
            }
        };

        return ScriptsService;
    }
]);

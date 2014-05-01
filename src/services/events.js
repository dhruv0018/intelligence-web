var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('EventsService', [
    '$q', '$sce', 'TAG_VARIABLE_TYPE', 'VIDEO_STATUSES', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'TagsetsFactory', 'PlaysFactory', 'PlayersFactory',
    function($q, $sce, TAG_VARIABLE_TYPE, VIDEO_STATUSES, leagues, teams, games, tagsets, plays, players) {

        var VARIABLE_PATTERN = /(__\d?__)/;

        var EventsService = {

            userScript: function(tagset, event) {

                return this.buildScript('userScript', tagset, event);
            },

            indexerScript: function(tagset, event) {

                return this.buildScript('indexerScript', tagset, event);
            },

            buildScript: function(scriptType, tagset, event) {

                if (!tagset) return [];
                if (!event || !event.tag || !event.tag.id) return [];

                var tagId = event.tag.id;
                var tags = tagset.getIndexedTags();
                var tag = tags[tagId];

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
                    var scriptItems = tag[scriptType].split(VARIABLE_PATTERN);

                    scriptItems = scriptItems.filter(function(item) {

                        return item !== '';
                    });

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

        return EventsService;
    }
]);

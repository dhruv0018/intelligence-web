var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('ScriptsService', [
    '$q', '$sce', 'TAG_VARIABLE_TYPE', 'VIDEO_STATUSES', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'TagsetsFactory', 'PlaysFactory', 'PlayersFactory',
    function($q, $sce, TAG_VARIABLE_TYPE, VIDEO_STATUSES, leagues, teams, games, tagsets, plays, players) {

        var VARIABLE_PATTERN = /(__\d__)/;
        var VARIABLE_INDEX_PATTERN = /\d/;

        var ScriptsService = {

            userScript: function(tagset, event) {

                return this.buildScript('userScript', tagset, event);
            },

            indexerScript: function(tagset, event) {

                return this.buildScript('indexerScript', tagset, event);
            },

            buildScript: function(scriptType, tagset, event) {

                if (!tagset) throw new Error('No tagset');
                if (!event) throw new Error('No event');

                var tags = tagset.getIndexedTags();

                if (!tags) throw new Error('Failed to get tags from tagset');

                var tag = tags[event.tagId];

                if (!tag) throw new Error('Could not find tag in tagset');

                var script = tag[scriptType];

                if (!script) return [];

                /* Mark the index of each variable. */
                    tagVariable.index = index + 1;
                });

                /* Split up script into array items and replace variables
                 * with the actual tag variable object. */
                return script.split(VARIABLE_PATTERN)

                .filter(function(item) {

                    return item.length;
                })

                .map(function(item) {

                    /* If the item is a variable. */
                    if (VARIABLE_PATTERN.test(item)) {

                        /* Find the index of the variable. */
                        var variableIndex = VARIABLE_INDEX_PATTERN.exec(item).pop() - 1;

                        /* Lookup the variable in the tag variables. */
                        return tag.tagVariables[variableIndex];
                    }

                    else return item;
                });
            }
        };

        return ScriptsService;
    }
]);

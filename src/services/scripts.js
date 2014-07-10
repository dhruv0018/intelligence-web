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

                /* Tag variables are ordered by where they appear in the scripts,
                 * but variable values are not ordered, so this position needs
                 * to be recored to place the variable in the script later. */
                tag.tagVariables.forEach(function(tagVariable, index) {

                    /* Mark the index of each variable by their location in the
                     * tagVariables array. */
                    tagVariable.index = index + 1;
                });

                /* Split up script into array items and replace variables
                 * with the actual tag variable object. */
                return script.split(VARIABLE_PATTERN)

                /* Filter script items. */
                .filter(function(item) {

                    /* Filter out empty items. */
                    return item.length;
                })

                /* Map script items. */
                .map(function(item) {

                    /* If the item is a variable. */
                    if (VARIABLE_PATTERN.test(item)) {

                        /* Find the index of the variable. */
                        var variableIndex = VARIABLE_INDEX_PATTERN.exec(item).pop() - 1;

                        /* Lookup the variable in the tag variables. */
                        return tag.tagVariables[variableIndex];
                    }

                    /* If the item is not a variable return it as is. */
                    else return item;
                });
            }
        };

        return ScriptsService;
    }
]);

var VARIABLE_PATTERN = /(__\d__)/;
var VARIABLE_INDEX_PATTERN = /\d/;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TagsetsFactory', [
    'BaseFactory', '$filter',
    function(BaseFactory, $filter) {

        var indexedTags = {};

        var TagsetsFactory = {

            description: 'tagsets',

            model: 'TagsetsResource',

            storage: 'TagsetsStorage',

            extend: function(tagset) {

                var self = this;

                angular.extend(tagset, self);

                var tags = {};

                tagset.tags.forEach(function(tag) {

                    if (angular.isArray(tag.tagVariables)) {

                        var indexedVariables = {};

                        tag.tagVariables.forEach(function(variable, index) {

                            indexedVariables[++index] = variable;

                            if (variable.formations) {

                                let indexedFormations = {};

                                variable.formations.forEach(formation => {

                                    indexedFormations[formation.id] = formation;
                                });

                                variable.formations = indexedFormations;
                            }
                        });

                        tag.tagVariables = indexedVariables;
                    }

                    ['userScript', 'indexerScript', 'summaryScript'].forEach(function(scriptType) {

                        var script = tag[scriptType];

                        if (script) {

                            /* Split up script into array items and replace variables
                            * with the actual tag variable object. */
                            tag[scriptType] = script.split(VARIABLE_PATTERN)

                            /* Filter script items. */
                            .filter(function(item) {

                                /* Filter out empty items. */
                                return item.length;
                            })

                            /* Map script items. */
                            .map(function(item) {

                                /* If the item is a variable. */
                                if (VARIABLE_PATTERN.test(item)) {

                                    /* Find the index of the variable in the script. */
                                    var index = Number(VARIABLE_INDEX_PATTERN.exec(item).pop());

                                    /* Find the tag variable by script index. */
                                    var tagVariable = tag.tagVariables[index];

                                    /* Store the index position of the tag variable. */
                                    tagVariable.index = index;

                                    return tagVariable;
                                }

                                /* If the item is not a variable return it as is. */
                                else return item;
                            });
                        }
                    });

                    tags[tag.id] = tag;
                    indexedTags[tag.id] = tag;
                });

                tagset.tags = tags;

                return tagset;
            },

            unextend: function(tagset) {

                var self = this;

                tagset = tagset || self;

                var copy = angular.copy(tagset);

                var tags = [];

                Object.keys(copy.tags).forEach(function(tagKey) {

                    var tag = copy.tags[tagKey];

                    ['userScript', 'indexerScript', 'summaryScript'].forEach(function(scriptType) {

                        var script = tag[scriptType];

                        if (script) {

                            tag[scriptType] = script
                            .map(function(item) {

                                if (angular.isString(item)) return item;
                                else return '__' + item.index + '__';
                            })
                            .join('');
                        }
                    });

                    if (tag.tagVariables) {

                        var tagVariables = [];

                        Object.keys(tag.tagVariables).forEach(function(tagVariableKey) {

                            var tagVariable = tag.tagVariables[tagVariableKey];

                            if (tagVariable.formations) {

                                let formations = [];

                                Object.keys(tagVariable.formations).forEach(tagVariableFormationsKey => {

                                    let formation = tagVariable.formations[tagVariableFormationsKey];

                                    formations.push(formation);
                                });

                                tagVariable.formations = formations;
                            }

                            tagVariables[--tagVariableKey] = tagVariable;
                        });

                        tag.tagVariables = tagVariables;
                    }

                    tags.push(tag);
                });

                copy.tags = tags;

                return copy;
            },

            getTag: function(tagId) {

                let tag = indexedTags[tagId];

                if (!tag) throw new Error('Tag ' + tagId + ' not found');

                return tag;
            },

            getTagMap: function() {

                return indexedTags;
            },

            getStartTags: function() {

                var self = this;

                var tags = this.tags;

                return Object.keys(tags)

                .map(function(key) {

                    return tags[key];
                })

                .filter(function(tag) {

                    return self.isStartTag(tag.id);
                });
            },

            getFloatTags: function() {

                var self = this;

                var tags = this.tags;

                return Object.keys(tags)

                .map(function(key) {

                    return tags[key];
                })

                .filter(function(tag) {

                    return self.isFloatTag(tag.id);
                });
            },

            getNextTags: function(tagId) {

                var tags = this.tags;
                var tag = tags[tagId];

                if (tag.children && tag.children.length) {

                    return tag.children.map(function(childId) {

                        return tags[childId];
                    })

                    .concat(this.getFloatTags());

                } else {

                    return this.getStartTags();
                }
            },

            isStartTag: function(tagId) {

                var tags = this.tags;
                var tag = tags[tagId];

                return tag.isStart;
            },

            isFloatTag: function(tagId) {

                var tags = this.tags;
                var tag = tags[tagId];

                return tag.isStart === false && tag.isEnd === false && tag.children && tag.children.length === 0;
            },

            isEndTag: function(tagId) {

                var tags = this.tags;
                var tag = tags[tagId];

                return tag.isEnd;
            }
        };

        angular.augment(TagsetsFactory, BaseFactory);

        return TagsetsFactory;
    }
]);

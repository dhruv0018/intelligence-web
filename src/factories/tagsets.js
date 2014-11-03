var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TagsetsFactory', [
    'BaseFactory', '$filter',
    function(BaseFactory, $filter) {

        var TagsetsFactory = {

            description: 'tagsets',

            model: 'TagsetsResource',

            storage: 'TagsetsStorage',

            extend: function(tagset) {

                var self = this;

                angular.extend(tagset, self);

                var indexedTags = {};

                tagset.tags.forEach(function(tag) {

                    if (angular.isArray(tag.tagVariables)) {

                        var indexedVariables = {};

                        tag.tagVariables.forEach(function(variable, index) {

                            indexedVariables[++index] = variable;

                            var indexedFormations = {};

                            variable.formations.forEach(function(formation) {

                                indexedFormations[formation.id] = formation;
                            });

                            variable.formations = indexedFormations;
                        });

                        tag.tagVariables = indexedVariables;
                    }

                    indexedTags[tag.id] = tag;
                });

                tagset.tags = indexedTags;

                return tagset;
            },

            unextend: function(tagset) {

                var self = this;

                tagset = tagset || self;

                var copy = angular.copy(tagset);

                var tags = [];

                Object.keys(copy.tags).forEach(function(tagKey) {

                    var tag = copy.tags[tagKey];

                    var tagVariables = [];

                    Object.keys(tag.tagVariables).forEach(function(tagVariableKey) {

                        var tagVariable = tag.tagVariables[tagVariableKey];

                        var formations = [];

                        Object.keys(tagVariable.formations).forEach(function(tagVariableFormationsKey) {

                            var formation = tagVariable.formations[tagVariableFormationsKey];

                            formations.push(formation);
                        });

                        tagVariable.formations = formations;

                        tagVariables[--tagVariableKey] = tagVariable;
                    });

                    tag.tagVariables = tagVariables;

                    tags.push(tag);
                });

                copy.tags = tags;

                return copy;
            },

            getStartTags: function() {

                var tags = this.tags;

                return Object.keys(tags)

                .map(function(key) {

                    return tags[key];
                })

                .filter(function(tag) {

                    return tag.isStart;
                });
            },

            getNextTags: function(tagId) {

                var tags = this.tags;
                var tag = tags[tagId];

                if (tag.children.length) {

                    return tag.children.map(function(childId) {

                        return tags[childId];
                    });

                } else {

                    return this.getStartTags();
                }
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


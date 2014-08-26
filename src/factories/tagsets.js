var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TagsetsFactory', [
    'TagsetsResource', 'TagsetsStorage', 'BaseFactory', '$filter',
    function(TagsetsResource, TagsetsStorage, BaseFactory, $filter) {

        var TagsetsFactory = {

            description: 'tagsets',

            storage: TagsetsStorage,

            resource: TagsetsResource,

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


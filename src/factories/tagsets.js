var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

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

                tagset.indexedTags = {};

                tagset.tags.forEach(function(tag) {

                    tagset.indexedTags[tag.id] = tag;

                    if (angular.isArray(tag.tagVariables)) {

                        var indexedVariables = {};

                        tag.tagVariables.forEach(function(variable, index) {

                            indexedVariables[++index] = variable;
                        });

                        tag.tagVariables = indexedVariables;
                    }
                });

                return tagset;
            },

            getIndexedTags: function() {

                return this.indexedTags;
            },

            getNextTags: function(tagId) {

                var tags = this.getIndexedTags();
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

                var tags = this.getIndexedTags();
                var tag = tags[tagId];

                return tag.isEnd;
            },

            getTagsByType: function(type) {
                results = [];
                switch (type) {
                    case 'START':
                        results = $filter('filter')(this.tags, {isStart: true, isEnd: false});
                        break;
                    case 'FLOAT':
                        tags =  $filter('filter')(this.tags, {isStart: false, isEnd: false});
                        tags.forEach(function(tag) {
                            if (!tag.children) {
                                results.push(tag);
                            }
                        });
                        break;
                    case 'STANDALONE':
                        tags =  $filter('filter')(this.tags, {isStart: true, isEnd: true});
                        tags.forEach(function(tag) {
                            if (!tag.children) {
                                results.push(tag);
                            }
                        });
                        break;
                }


                return results;
            },

            getStartTags: function() {

                return this.tags.filter(function(tag) {

                    return tag.isStart;
                });
            }
        };

        angular.augment(TagsetsFactory, BaseFactory);

        return TagsetsFactory;
    }
]);


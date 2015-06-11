import KrossoverTag from '../entities/tag.js';

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

                angular.extend(tagset, this);

                let tags = {};

                tagset.tags.forEach(function(tag) {

                    tag = new KrossoverTag(tag);

                    tags[tag.id] = tag;
                    indexedTags[tag.id] = tag;
                });

                tagset.tags = tags;

                return tagset;
            },

            unextend: function(tagset) {

                tagset = tagset || this;

                let copy = angular.copy(tagset);
                let tags = [];

                Object.keys(copy.tags).forEach(tagKey => {

                    let tag = copy.tags[tagKey];
                    tags.push(JSON.stringify(tag));
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

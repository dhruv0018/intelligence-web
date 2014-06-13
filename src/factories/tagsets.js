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

            getIndexedTags: function() {

                var indexedTags = {};

                this.tags.forEach(function(tag) {

                    indexedTags[tag.id] = tag;
                });

                return indexedTags;
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


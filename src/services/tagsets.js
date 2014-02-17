var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TagsetsFactory', [
    'TagsetsResource', '$filter',
    function(TagsetsResource, $filter) {

        var TagsetsFactory = {

            resource: TagsetsResource,

            indexedTags: {},

            extendTagset: function(tagset) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "tagset" object. */
                angular.extend(tagset, self);

                return tagset;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(tagset) {

                    tagset = self.extendTagset(tagset);

                    return success ? success(tagset) : tagset;
                };

                error = error || function() {

                    throw new Error('Could not get tagset');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};

                var callback = function(tags) {

                    tags.forEach(function(tagset) {

                        tagset = self.extendTagset(tagset);

                        self.indexedTags[tagset.id] = tagset;
                    });

                    tags = index ? self.indexedTags : tags;

                    return success ? success(tags) : tags;
                };

                error = error || function() {

                    throw new Error('Could not load tags');
                };

                return self.resource.query(filter, callback, error);
            },

            getIndexedTags: function() {

                return this.indexedTags;
            },

            getTagsByType: function(type) {
                results = [];
                switch(type) {
                    case 'START':
                        results = $filter('filter')(this.tags, {isStart: true, isEnd: false});
                        break;
                    case 'FLOAT':
                        tags =  $filter('filter')(this.tags, {isStart: false, isEnd: false});
                        tags.forEach(function(tag) {
                            if(!tag.children) {
                                results.push(tag);
                            }
                        });
                        break;
                    case 'STANDALONE':
                        tags =  $filter('filter')(this.tags, {isStart: true, isEnd: true});
                        tags.forEach(function(tag) {
                            if(!tag.children) {
                                results.push(tag);
                            }
                        });
                        break;
                }


                return results;
            }
        };

        return TagsetsFactory;
    }
]);


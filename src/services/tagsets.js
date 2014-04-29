var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('TagsetsFactory', [
    'TagsetsResource', '$filter',
    function(TagsetsResource, $filter) {

        var TagsetsFactory = {

            resource: TagsetsResource,

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

                var callback = function(tagsets) {

                    var indexedTagsets = {};

                    tagsets.forEach(function(tagset) {

                        tagset = self.extendTagset(tagset);

                        indexedTagsets[tagset.id] = tagset;
                    });

                    tagsets = index ? indexedTagsets : tagsets;

                    return success ? success(tagsets) : tagsets;
                };

                error = error || function() {

                    throw new Error('Could not load tagsets');
                };

                return self.resource.query(filter, callback, error);
            },

            getIndexedTags: function() {

                var indexedTags = {};

                this.tags.forEach(function(tag) {

                    indexedTags[tag.id] = tag;
                });

                return indexedTags;
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
            },

            getStartTags: function() {

                return this.tags.filter(function(tag) {

                    return tag.isStart;
                });
            }
        };

        return TagsetsFactory;
    }
]);


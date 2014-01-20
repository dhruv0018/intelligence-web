var IntelligenceWebClient = require('../app');

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
            
            get: function(tagsetId, success, error) {

                var self = this;
                error = error || function() {
                    throw new Error('Could not get tagset');
                };

                return self.resource.get({ id: tagsetId }, function(tagset) {
                    self.extendTagset(tagset); // making sure tagset is definitely extended before returning
                    return success? success(tagset) : tagset;
                }, error);
            },

            getList: function(filter, success, error) {

                var self = this;
                filter = filter || {};
                error = error || function() {
                    throw new Error('Could not load tagsets list');
                };

                return self.resource.query(filter, function(tagsets) {
                    tagsets.forEach(self.extendTagset, self); // making sure tagsets are definitely extended before returning
                    return success? success(tagsets) : tagsets;
                }, error);
            },
            
            getIndexedTags: function() {
                indexedTags = {};
                this.tags.forEach( function(tag) {
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
            }
        };

        return TagsetsFactory;
    }
]);


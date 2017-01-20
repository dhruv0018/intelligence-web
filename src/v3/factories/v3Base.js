const PAGE_SIZE = 100;

const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

//test Data, you can try multiple.json for multiple array of include, single.json for single include item
const testData = require('../data/multiple.json');
/**
 * Base factory
 * @module IntelligenceWebClient
 * @name v3BaseFactory
 * @type {factory}
 */
IntelligenceWebClient.factory('v3BaseFactory', [
    '$q',
    '$injector',
    'Utilities',
    '$http',
    'config',
    'v3Resource',
    'v3DataParser',
    'RootStorage',
    function(
        $q,
        $injector,
        util,
        http,
        config,
        v3Resource,
        v3DataParser,
        root)
    {
        var v3BaseFactory = {

            PAGE_SIZE,

            /**
             * Extends resource with all of the properties from its factory.
             * @param {Resource} resource - a user resource object.
             */
            extend: function(resource) {

                let self = this;

                angular.extend(resource, self);

                if(!resource.type && resource.description){
                    resource.type = resource.description;
                }

                return resource;
            },
            /**
             * Removes extended properties of the resource.
             * @param {Resource} resource - a user resource object.
             */
            unextend: function(resource) {

                let self = this;

                resource = resource || self;

                /* Create a copy of the resource to break reference to orginal. */
                let copy = angular.copy(resource);

                delete copy.PAGE_SIZE;
                delete copy.description;
                delete copy.model;

                Object.keys(copy).forEach(function(key){
                    if(typeof copy[key] === 'function'){
                        delete copy[key];
                    }
                });
                return copy;
            },
            /**
             * Creates a new resource.
             * @return {Resource} - a resource.
             */
            create: function(resource ={}){

                let self = this;

                let Model = self.model ? $injector.get(self.model) : v3Resource.createResource(self.description);

                resource = new Model(resource);

                resource = self.extend(resource);

                return resource;
            },
            /**
             * Queries resources from the server.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise.<Array.Resource>} - a promise of an array of resources.
             */
            load: function(filter, saveToStorage=false, success, error, final) {
                let self = this;
                let isPaginated = false;

                if (angular.isFunction(filter)) {

                    error = success;
                    success = filter;
                    filter = null;
                }
                /* Making a copy of the filter here so that the start and count
                 * properties don't get added to the filter if not passed in as a literal.  */
                filter = angular.copy(filter) || {};

                /* If filtering by an array of IDs. */
                if (filter['id[]']) {

                    /* Clear start and count filters. */
                    filter.page = null;
                    filter['id[]'] = util.unique(filter['id[]']);
                }

                if (filter["page[size]"] || filter["page[number]"]) {
                    filter["page[size]"] = filter["page[size]"] || self.PAGE_SIZE || PAGE_SIZE;
                    filter["page[number]"] = filter["page[number]"] || 1;
                    isPaginated = true;
                }

                let aFilterIsUndefined = Object.keys(filter).some(function(key) {

                    if (angular.isArray(filter[key])) return !filter[key].length;
                    else return angular.isUndefined(filter[key]);
                });

                if (aFilterIsUndefined) console.error('Undefined filter in ' + self.description + ' ' + JSON.stringify(filter));

                success = success || function(resources) {
                    return resources;
                };
                error = error || function() {

                    throw new Error('Could not load ' + self.description + ' list');
                };

                let request = self.retrieve(filter, saveToStorage, isPaginated);

                request.catch(error)
                        .then(success);

                if (final) request.finally(final);

                return request;

            },
            /**
             * Retrieves all resources from the server.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @param {Array} queryData - data parameter of resources
             * @param {Array} queryIncluded - included parameter of resources
             * @return {Promise.<Map.<Number,Resource>>} - a promise of a map of resources.
             */
            retrieve(filter, saveToStorage = false, isPaginated = false, queryData = [], queryIncluded = []) {
                /* Make a GET request to the server for an array of resources. */
                let model = this.model ? $injector.get(this.model) : v3Resource.createResource(this.description);
                let query = model.get(filter);
                if(saveToStorage){
                    root[this.description] = root[this.description] || {};
                }

                let request = query.$promise.then((resources) => {
                    const isPageRetryLimit = (resources.meta && resources.meta['total-pages'] && resources.meta['total-pages'] > 1) ? (filter["page[number]"] >= resources.meta['total-pages']) : true;

                    if (!isPaginated && !isPageRetryLimit) {
                        queryData = queryData.concat(resources.data);
                        queryIncluded = queryIncluded.concat(resources.included);

                        //need to pull more data
                        if(filter["page[size]"] && filter["page[number]"]){
                            filter["page[number]"] = filter["page[number]"]+1;
                        }else{
                            //no paginated filter set
                            filter["page[size]"] = resources.data.length;
                            filter["page[number]"] = 2;
                        }
                        return this.retrieve(filter, saveToStorage, isPaginated, queryData, queryIncluded);
                    }else{
                        resources.data = queryData.concat(resources.data);
                        resources.included = resources.included ? queryIncluded.concat(resources.included): queryIncluded;
                        let parsedResources = Object.assign({}, resources);
                        parsedResources.transformed = v3DataParser.parseData(resources);

                        const parsedResourcesData = parsedResources.transformed;

                        if (Array.isArray(parsedResourcesData)) {
                            parsedResourcesData.forEach(resourceData => this.extendTransformedData(resourceData, saveToStorage));
                        } else {
                            this.extendTransformedData(parsedResourcesData, saveToStorage);
                        }

                        return parsedResources;
                    }
                });

                return request;
            },
            extendTransformedData(resourceData, saveToStorage) {
                resourceData = this.extend(resourceData);
                if(resourceData.includes){
                    angular.forEach(resourceData.includes, (data, key) =>{
                        if(Array.isArray(data)){
                            //check if that type links to a factory for extend
                            angular.forEach(data, (value, key)=>{
                                if(value.type){
                                    let factoryName = v3DataParser.constructFactoryFromString(value.type);
                                    if($injector.has(factoryName)){
                                        //extend the object
                                        value = $injector.get(factoryName).extend(value);
                                    }
                                }
                            });

                        }else{
                            //check if that type links to a factory for extend
                            let factoryName = v3DataParser.constructFactoryFromString(data.type);
                            if($injector.has(factoryName)){
                                data = $injector.get(factoryName).extend(data);
                            }
                        }
                    });
                }
                //save data to memory if specified
                if(saveToStorage){
                    root[this.description][resource.id] = resourceData;
                }
            },
            /**
             * @class BaseFactory
             * @method save
             * @description Saves a resources to the server if it doesn't get debounced
             * @param {Resource} resource - a resource.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @param {=boolean} debounce - debounce by default
             * @return {Promise.<Resource>} - a promise of a resources.
             */
            save: function(resource, success, error, debounce = false) {

                let baseSave = this.baseSave.bind(this);

                if (debounce) {

                    this.debouncedBaseSave = this.debouncedBaseSave || util.promiseDebounce.call(this, baseSave);

                    baseSave = this.debouncedBaseSave;
                }

                //TODO: find a less hacky way to do this
                return baseSave(resource, success, error);

            },
            baseSave: function(resource, success, error) {
                //TODO need to find out the reason for debounce, whether or not we need it for v3
                //Jsonapi standard for updating/creating http://jsonapi.org/format/#crud
                let self = this;
                resource = resource || self;

                //make sure relationships block is updated with transformed block
                if(resource.transformed && resource.relationships){
                    let relationships = {};
                    angular.forEach(resource.transformed, (value, key)=>{
                        relationships[key] = [];
                        angular.forEach(value, data=>{
                            relationships[key].push({id: data.id, type: data.type});
                        });
                    });
                    resource.relationships = relationships;
                }
                let copy = {
                    data: {
                        type: resource.type,
                        attributes: self.unextend(resource)
                    }
                };
                delete copy.data.attributes.type;

                let parameters = {};

                resource.isSaving = true;
                if(resource.id){
                    //updating existing resource
                    let update;
                    if(resource.links && resource.links.self){
                        //a custom link for the resource post
                        let customUrl = resource.links.self.split('/v3/')[1];
                        let model = v3Resource.createResource(customUrl);
                        update = model.update(parameters, copy, success, error);
                    }else{
                        update = resource.update(parameters, copy, success, error);
                    }

                    return update.$promise
                    .then(function(updated){
                        if (resource.updateLocalResourceOnPUT) {
                            /* Update local resource with server resource. */
                            angular.extend(resource, self.extend(updated));
                        }

                        delete resource.error;

                        return resource;
                    })
                    .catch(function(){
                        resource.error = true;
                    })
                    .finally(function(){
                        delete resource.isSaving;
                    });

                }else{
                    // we need to create new resource
                    let model = self.model ? $injector.get(self.model) : v3Resource.createResource(self.description);
                    let create = model.create(parameters, copy, success, error);

                    return create.$promise
                    .then(function(created){
                        angular.extend(resource, self.extend(created));

                        delete resource.error;

                        return resource;
                    })
                    .catch(function(){
                        resource.error = true;
                    })
                    .finally(function(){
                        delete resource.isSaving;
                    });
                }

                //update included objects based on their type, TODO need to test
                if(resource.transformed && resource.relationships){
                    angular.forEach(resource.transformed, (value, key)=>{
                        angular.forEach(value, data=>{
                            let factoryName = v3DataParser.constructFactoryFromString(data.type);
                            if($injector.has(factoryName)){
                                data = $injector.get(factoryName).unextend(data);
                                data.save();
                            }
                        });
                    });
                }
            },
            /**
             * Gets a single resource from memrory by ID.
             * @param {Number} id - a resource ID.
             * @returns {Resource} - a resource.
             */
            get: function(id) {

                var self = this;

                if(root[self.description]){
                    return root[self.description][id];
                }else{
                    return null;
                }
            },
            /**
             * @class BaseFactory
             * @method updateList
             * @description Save an array of data
             * @param {data} data - array of resource.
             * @return {Promise.<Resource>} - a promise of a resources.
             */
            updateList: function(data){
                //TODO might need to unextend data
                let self = this;
                let model = self.model ? $injector.get(self.model) : v3Resource.createResource(self.description);

                return model.save({}, data).$promise;
            }
        };

        return v3BaseFactory;
    }
]);

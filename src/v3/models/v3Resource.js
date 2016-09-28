const pkg = require('../../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3Resource', [
    'config', '$resource',
    function(config, $resource) {

        const urlGenerator ={
            createIncludesParams(includes) {
                return includes ? `include=${includes.join(',')}` : '';
            },
            createFieldsParams(fields) {
                let fieldsArray = [],
                field;

                if (!fields) {
                    return '';
                }

                for (field in fields) {
                    if (fields.hasOwnProperty(field)) {
                        fieldsArray.push(`fields[${field}]=${fields[field].join(',')}`);
                    }
                }

                return fieldsArray.join('&');
            },
            createParams(opts = {}) {
                let includes = opts.includes;
                let fields = opts.fields;
                let fieldParams = this.createFieldsParams(fields);
                let sparseFields = fieldParams ? `&${fieldParams}` : "";
                return (includes || fields) ? '?' + this.createIncludesParams(includes) + sparseFields : '';
            },
            createEndpoint(baseEndpoint, opts){
                return opts ? this.createParams(opts) : '';
            }
        };

        const service = {

            createResource(baseEndpoint, opts={}){
                if(!baseEndpoint){
                    return false;
                }
                let urlPart, params, actions;
                let url = `${config.apiV3.uri}${baseEndpoint}`;
                if(opts.params){
                    urlPart = urlGenerator.createEndpoint(baseEndpoint, opts.params);
                }else{
                    urlPart = urlGenerator.createEndpoint(baseEndpoint);
                }
                opts.actions = (opts && opts.actions) ? opts.actions : {};
                actions = {
                    create: { method: 'POST' },
                    update: { method: 'PUT' },
                    get: { method: 'GET', url: `${url}${urlPart}` } //get method add include params
                };
                angular.extend(actions, opts.actions);
                return $resource(url, {}, actions);
            }

        };

        return service;
    }
]);

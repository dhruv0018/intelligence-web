const pkg = require('../../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3ExampleResource', [
    'config', 'v3Resource',
    function(config, v3Resource) {

        let opts ={};
        opts.params ={
            includes: ['object1', 'object2', 'object3'],
            fields: {
                'object1': ['id', 'name', 'property1'],
                'object2': ['id', 'name', 'width'],
                'object3': ['id', 'name', 'height']
            }
        };

        opts.actions = {
            getSpecial:{
                method: 'GET',
                url: `${config.apiV3.uri}:relatedId/getSpecial`,
                params: {relatedId: '@relatedId'}
            }
        };

        return v3Resource.createResource('example', opts);

    }
]);

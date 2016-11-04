const pkg = require('../../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3TeamsResource', [
    'config', 'v3Resource',
    function(config, v3Resource) {

        let opts ={};

        return v3Resource.createResource('teams', opts);
    }
]);

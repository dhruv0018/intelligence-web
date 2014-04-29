var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

var SCHOOL_TYPE = {

    COLLEGE: 1,
    UNIVERSITY: 1,
    HIGH_SCHOOL: 2,
    OTHER: 3
};

IntelligenceWebClient.constant('SCHOOL_TYPE', SCHOOL_TYPE);

var SCHOOL_TYPES = [

    {
        id: SCHOOL_TYPE.UNIVERSITY,
        name: 'University/College'
    },

    {
        id: SCHOOL_TYPE.HIGH_SCHOOL,
        name: 'High School'
    },

    {
        id: SCHOOL_TYPE.OTHER,
        name: 'Other'
    }
];

IntelligenceWebClient.constant('SCHOOL_TYPES', SCHOOL_TYPES);

IntelligenceWebClient.factory('SchoolsResource', [
    'config', '$resource',
    function(config, $resource) {

        var SchoolsResource = $resource(

            config.api.uri + 'schools/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return SchoolsResource;
    }
]);


var IntelligenceWebClient = require('../app');

var SCHOOL_TYPE = {

    COLLEGE: 1,
    UNIVERSITY: 1,
    HIGH: 2,
    HIGH_SCHOOL: 2,
    OTHER: 3
};

IntelligenceWebClient.constant('SCHOOL_TYPE', SCHOOL_TYPE);

var SCHOOL_TYPES = [

    {
        type: {

            id: SCHOOL_TYPE.UNIVERSITY,
            name: 'University/College'
        },

        type: {

            id: SCHOOL_TYPE.HIGH_SCHOOL,
            name: 'High School'
        },

        type: {

            id: SCHOOL_TYPE.OTHER,
            name: 'Other'
        }
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


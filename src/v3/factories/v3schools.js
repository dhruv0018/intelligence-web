const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3SchoolFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    function(
        config,
        $injector,
        v3BaseFactory
    ) {

        const SchoolFactory = {

            PAGE_SIZE,

            description: 'school',

            extend: function(school){
                let self = this;

                angular.augment(school, self);

                return school;
            },

            unextend: function(example){
                let self = this;

                example = example || self;

                let copy = v3BaseFactory.unextend(example);

                return copy;
            }
        };

        angular.augment(SchoolFactory, v3BaseFactory);

        return SchoolFactory;
    }
]);

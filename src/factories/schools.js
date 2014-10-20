var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SchoolsFactory', [
    '$injector', 'BaseFactory', 'ResourceManager', 'SCHOOL_TYPES',
    function($injector, BaseFactory, managedResources, SCHOOL_TYPES) {

        var SchoolsFactory = {

            description: 'schools',

            model: 'SchoolsResource',

            storage: 'SchoolsStorage',

            extend: function(school) {
                var self = this;


                //todo hotfixed but we should convert it to a real fix later
                self.type = {
                    id: school.type
                };

                angular.forEach(SCHOOL_TYPES, function(schoolType) {
                    if (schoolType.id === self.type.id) {
                        self.type.name = schoolType.name;
                    }
                });

                angular.extend(school, self);

                return school;
            },

            unextend: function(school) {

                var self = this;

                school = school || self;

                var copy = angular.copy(school);

                //TODO temporary fix
                copy.type = copy.type.id;

                return copy;
            }
        };

        angular.augment(SchoolsFactory, BaseFactory);

        return SchoolsFactory;
    }
]);


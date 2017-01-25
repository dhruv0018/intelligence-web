var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SchoolsFactory', [
    '$injector',
    'BaseFactory',
    'SCHOOL_TYPES',
    'config',
    '$q',
    function(
        $injector,
        BaseFactory,
        SCHOOL_TYPES,
        config,
        $q
    ) {

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
            /**
            * @class Schools
            * @method getSchoolsList
            * This is the hack we use to make pagination work, will be replaced
            *
            * @param {Object} filter - Filter to query
            * @param {bool} getHead - switch to show total count in header response
            * @returns {Object} - paginated user data with optional count attribute
            */
            getSchoolsList: function(filter, getHead = true){
                let query = filter || {};
                query.count = (filter && filter.count) ? filter.count : 30;
                query.start = (filter && filter.page) ? (filter.page-1)*query.count : 0;
                delete query.page;
                let schoolsPromises = this.query(query);
                let promises = [schoolsPromises];

                if(getHead){
                    let url = `${config.api.uri}schools`;
                    let countPromises = this.totalCount(query, url);
                    promises.push(countPromises);
                }

                return $q.all(promises).then(
                    data =>{
                        let schools = {};
                        schools.data = data[0];
                        if(getHead){
                            schools.count = data[1];
                        }
                        return schools;
                    }
                );

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

// v3ExampleFactory.getSpecial({relatedId: 99});
//Generate links like: http://v2-pre-prod-app.krossover.com/intelligence-api/v3/99/getSpecial

//v3ExampleFactory.load();
//Generate network call like: http://v2-pre-prod-app.krossover.com/intelligence-api/v3/example?include=object1,object2,object3&fields[object1]=id,name,property1&fields[object2]=id,name,width&fields[object3]=id,name,height&count=1000&start=0

const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3ExampleFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    'v3ExampleResource',
    function(
        config,
        $injector,
        v3BaseFactory,
        v3ExampleResource
    ) {

        const ExampleFactory = {

            PAGE_SIZE,

            description: 'example',

            model: 'v3ExampleResource',

            extend: function(example){
                let self = this;

                angular.augment(example, self);
                example.property1 = example.id+example.type;

                return example;
            },

            unextend: function(example){
                let self = this;

                example = example || self;

                let copy = v3BaseFactory.unextend(example);
                delete copy.property1;

                return copy;
            },

            getSpecial: function(filter){
                let self = this;
                let model = $injector.get(self.model);
                return model.getSpecial(filter).$promise;
            }
        };

        angular.augment(ExampleFactory, v3BaseFactory);

        return ExampleFactory;
    }
]);

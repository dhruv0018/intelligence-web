const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3ProductsFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    function(
        config,
        $injector,
        v3BaseFactory
    ) {

        const ProductsFactory = {

            PAGE_SIZE,

            description: 'products',

            extend: function(products){
                let self = this;

                angular.augment(products, self);

                return products;
            },

            unextend: function(products){
                let self = this;

                products = products || self;

                let copy = v3BaseFactory.unextend(products);

                return copy;
            }
        };

        angular.augment(ProductsFactory, v3BaseFactory);

        return ProductsFactory;
    }
]);

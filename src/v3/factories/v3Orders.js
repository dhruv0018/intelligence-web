const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3OrdersFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    function(
        config,
        $injector,
        v3BaseFactory
    ) {

        const OrdersFactory = {

            PAGE_SIZE,

            description: 'orders',

            model: 'v3OrdersResource',

            extend: function(orders) {
                let self = this;

                angular.augment(orders, self);

                return orders;
            },

            unextend: function(orders) {
                let self = this;

                orders = orders || self;

                let copy = v3BaseFactory.unextend(orders);

                return copy;
            },

            createOrder: function(data) {
                const model = $injector.get(this.model);
                return model.createOrder({data}).$promise;
            },

            setProductId: function(orderId, data) {
                const model = $injector.get(this.model);
                return model.setProductId({orderId}, {data}).$promise;
            },

            submitOrder: function(orderId, data) {
                const model = $injector.get(this.model);
                return model.submitOrder({orderId}, {data}).$promise;
            }
        };

        angular.augment(OrdersFactory, v3BaseFactory);

        return OrdersFactory;
    }
]);

const pkg = require('../../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3OrdersResource', [
    'config', 'v3Resource',
    function(config, v3Resource) {

        let opts ={};

        opts.actions = {
            createOrder: {
                method: 'POST',
                url: `${config.apiV3.uri}orders`
            },
            setProductId: {
                method: 'POST',
                url: `${config.apiV3.uri}orders/:orderId/products`,
                params: {orderId: '@orderId', productId: '@productId'}
            },
            submitOrder: {
                method: 'POST',
                url: `${config.apiV3.uri}orders/:orderId/submit`,
                params: {orderId: '@orderId', paymentMethodNonce: '@paymentMethodNonce'}
            }
        };

        return v3Resource.createResource('orders', opts);

    }
]);

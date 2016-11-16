const angular = window.angular;

/**
 * BreakdownPurchase Service
 * @module BreakdownPurchase
 * @name BreakdownPurchase.Service
 * @type {Service}
 */

BreakdownPurchaseModal.$inject = [
    '$modal',
    'BreakdownPurchase.ModalOptions',
    'v3ProductsFactory'
];

function BreakdownPurchaseModal(
    $modal,
    $modalOptions,
    v3ProductsFactory
) {

    const definition = {

        open: function(products, updateRemainingBreakdowns) {
            var resolves = {
                resolve: {
                    products: () => products,
                    updateRemainingBreakdowns: () => updateRemainingBreakdowns
                }
            };

            var options = angular.extend($modalOptions, resolves);

            return $modal.open(options);
        }

    };


    return definition;
}

export default BreakdownPurchaseModal;

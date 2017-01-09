const braintree = require('braintree-web');
const DAYSUNTILPACKAGEEXPIRES = 90;

/**
 * Breakdown Purchase controller class
 * @class BreakdownPurchase
 */

BreakdownPurchaseController.$inject = [
    '$scope',
    '$uibModalInstance',
    '$timeout',
    'products',
    'updateRemainingBreakdowns',
    'v3OrdersFactory',
    'SessionService',
    'AnalyticsService'
];

function BreakdownPurchaseController (
    $scope,
    $uibModalInstance,
    $timeout,
    products,
    updateRemainingBreakdowns,
    v3OrdersFactory,
    session,
    analytics
) {
    let userId = session.getCurrentUserId();
    let teamId = session.getCurrentRole().teamId;

    $scope.showCreditCardView = false;
    $scope.showPaypalView = false;
    $scope.showConfirmationView = false;
    $scope.creatingOrder = false;
    $scope.submittingOrder = false;
    $scope.disableCCForm = true;
    $scope.showTransactionError = false;
    $scope.packages = products.data.map(product => {
        let adjustedProduct = product.attributes;
        adjustedProduct.id = product.id;
        return adjustedProduct;
    });

    $scope.packageExpirationDate = function() {
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + DAYSUNTILPACKAGEEXPIRES);
        return expirationDate;
    };

    $scope.createOrder = function() {
        $scope.creatingOrder = true;
        let createOrderData = {
            type: 'orders',
            attributes: {
                orderedByUserId: userId,
                orderedByTeamId: teamId
            }
        };
        v3OrdersFactory.createOrder(createOrderData).then(createOrderResponse => {
            let setProductIdData = {
                type: 'order-product-details',
                attributes: {
                    productId: Number($scope.selectedPackage.id),
                    quantity: 1
                }
            };
            v3OrdersFactory.setProductId(createOrderResponse.data.id, setProductIdData).then(setProductIdResponse => {
                let clientToken = createOrderResponse.data.attributes.clientToken;
                getHostedFields(clientToken, createOrderResponse.data.id, setProductIdResponse.data.attributes);
            });
        });
    };

    function getHostedFields(clientToken, orderId, itemInCart) {
        // Create Braintree client
        let form = document.querySelector('#checkout-form');
        let submit = document.querySelector('button[type="submit"]');

        $timeout(function() {
            $scope.showCreditCardView = true;
            $scope.creatingOrder = false;
        }, 2000);

        braintree.client.create({
            authorization: clientToken
        }, function (clientErr, clientInstance) {
            if (clientErr) {
                // Handle error in client creation
                console.error(clientErr);
                return;
            }

            braintree.hostedFields.create({
                client: clientInstance,
                styles: {
                    'input': {
                        'font-size': '16px',
                        'font-family': '"Franklin Gothic"'
                    },
                    'input.invalid': {
                        'color': 'red'
                    },
                    'input.valid': {
                        'color': 'green'
                    },
                    'select': {
                        'font-family': '"Franklin Gothic"'
                    }
                },
                fields: {
                    postalCode: {
                        selector: '#postal-code',
                        maxlength: '5'
                    },
                    number: {
                        selector: '#card-number'
                    },
                    cvv: {
                        selector: '#cvv'
                    },
                    expirationMonth: {
                        selector: '#expiration-month',
                        select: {
                            options: [
                                '01 - January',
                                '02 - February',
                                '03 - March',
                                '04 - April',
                                '05 - May',
                                '06 - June',
                                '07 - July',
                                '08 - August',
                                '09 - September',
                                '10 - October',
                                '11 - November',
                                '12 - December'
                            ]
                        }
                    },
                    expirationYear: {
                        selector: '#expiration-year',
                        select: true
                    }
                }
            }, function (hostedFieldsErr, hostedFieldsInstance) {
                if (hostedFieldsErr) {
                    // Handle error in Hosted Fields creation
                    console.error(hostedFieldsErr);
                    return;
                }

                hostedFieldsInstance.on('validityChange', (event) => {

                    let formValid = Object.keys(event.fields).every(function (key) {
                        return event.fields[key].isValid;
                    });

                    if (formValid) {
                        $scope.disableCCForm = false;
                    } else {
                        $scope.disableCCForm = true;
                    }

                    $scope.$apply();
                });

                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    $scope.showTransactionError = false;
                    $scope.submittingOrder = true;

                    hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                        if (tokenizeErr) {
                            // Handle error in Hosted Fields tokenization
                            console.error(tokenizeErr);
                            $scope.submittingOrder = false;
                            return;
                        }

                        // Send `payload.nonce` to Krossover API to let them handle the transaction
                        document.querySelector('input[name="payment-method-nonce"]').value = payload.nonce;
                        let submitOrderData = {
                            paymentMethodNonce: payload.nonce
                        };
                        v3OrdersFactory.submitOrder(orderId, submitOrderData).then(submitOrderResponse => {
                            analytics.track('Breakdown Package Purchased', {
                                'Number of Breakdowns': $scope.selectedPackage.unitQuantity.toString(),
                                'Turnaround Time': $scope.selectedPackage.minTurnaroundTime.toString() + '-' + $scope.selectedPackage.maxTurnaroundTime.toString() + ' hours',
                                'Price': '$' + $scope.selectedPackage.price.toString(),
                                'Transaction Completion': 'Transaction Succeeded'
                            });

                            $scope.submittingOrder = false;
                            $scope.showCreditCardView = false;
                            $scope.showConfirmationView = true;
                            updateRemainingBreakdowns();
                        }, submitOrderError => {
                            analytics.track('Breakdown Package Purchased', {
                                'Number of Breakdowns': $scope.selectedPackage.unitQuantity.toString(),
                                'Turnaround Time': $scope.selectedPackage.minTurnaroundTime.toString() + '-' + $scope.selectedPackage.maxTurnaroundTime.toString() + ' hours',
                                'Price': '$' + $scope.selectedPackage.price.toString(),
                                'Transaction Completion': 'Transaction Failed'
                            });

                            // Handle transaction error
                            $scope.showTransactionError = true;
                            $scope.submittingOrder = false;
                        });
                    });
                }, false);
            });
        });
    }
}

export default BreakdownPurchaseController;

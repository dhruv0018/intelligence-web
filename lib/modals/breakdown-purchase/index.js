const angular = window.angular;

import BreakdownPurchaseController from './controller';
import BreakdownPurchaseModal from './modal';

/**
 * BreakdownPurchase Module.
 * @module BreakdownPurchase
 */
const BreakdownPurchase = angular.module('BreakdownPurchase', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * BreakdownPurchase Modal
 * @module BreakdownPurchase
 * @name BreakdownPurchase.Modal
 * @type {service}
 */
BreakdownPurchase.value('BreakdownPurchase.ModalOptions', {
    templateUrl: 'lib/modals/breakdown-purchase/template.html',
    controller: BreakdownPurchaseController,
    size: 'lg'
});

BreakdownPurchase.controller('BreakdownPurchase.Controller', BreakdownPurchaseController);
BreakdownPurchase.service('BreakdownPurchase.Modal', BreakdownPurchaseModal);

export default BreakdownPurchase;

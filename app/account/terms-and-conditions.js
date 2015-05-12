/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Account page module.
 * @module Account
 */
const Account = angular.module('Account');

/* Template */
const templateUrl = 'account/terms-and-conditions.html';
const template    = require('./terms-and-conditions.html');

/* Cache the template file */
Account.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Account controller.
 * @module Account
 * @name Account.TermsAndConditions.controller
 * @type {controller}
 */

AccountTermsAndConditionsController.$inject = [];

function AccountTermsAndConditionsController () {

}

Account.controller('Account.TermsAndConditions.controller', AccountTermsAndConditionsController);

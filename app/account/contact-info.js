/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Account page module.
 * @module Account
 */
var Account = angular.module('Account');

/* Cache the template file */
Account.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('account/contact-info.html', require('./contact-info.html'));
    }
]);

/**
 * Account controller.
 * @module Account
 * @name Account.ContactInfo.controller
 * @type {controller}
 */
Account.controller('Account.ContactInfo.controller', [
    function controller() {

    }
]);


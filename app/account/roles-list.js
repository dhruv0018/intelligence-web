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

        $templateCache.put('account/roles-list.html', require('./roles-list.html'));
    }
]);

/**
 * Account controller.
 * @module Account
 * @name Account.RolesList.controller
 * @type {controller}
 */
Account.controller('Account.RolesList.controller', [
    function controller() {

    }
]);


/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template files */
Users.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('user.html', require('./user.html'));
        $templateCache.put('adduser.html', require('./adduser.html'));
        $templateCache.put('newrole.html', require('./newrole.html'));
        $templateCache.put('users.html', require('./users.html'));
        $templateCache.put('user-info.html', require('./user-info.html'));
        $templateCache.put('user-roles.html', require('./user-roles.html'));
    }
]);

/* File dependencies */
require('./states');
require('./filters');
require('./directives');
require('./user-controller');
require('./users-controller');

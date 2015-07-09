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
    'ui.showhide',
    'ngMaterial'
]);

/* Cache the template files */
Users.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('users/users.html', require('./users.html'));
        $templateCache.put('users/user.html', require('./user.html'));
        $templateCache.put('users/user-info.html', require('./user-info.html'));
        $templateCache.put('users/user-roles.html', require('./user-roles.html'));
        $templateCache.put('users/adduser.html', require('./adduser.html'));
        $templateCache.put('users/newrole.html', require('./newrole.html'));
    }
]);

/**
 * Admin Users Data service.
 * @module Users
 * @type {service}
 */
Users.service('Admin.Users.Data.Dependencies', [
    'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function(sports, leagues, teams, users) {

        var Data = {

            sports: sports.load(),
            leagues: leagues.load()
        };

        return Data;
    }
]);

/* File dependencies */
require('./states');
require('./filters');
require('./directives');
require('./user-controller');
require('./new-user-controller');
require('./user-info-controller');
require('./user-roles-controller');
require('./users-controller');

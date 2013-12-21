var pkg = require('../package.json');

var IntelligenceWebClient = angular.module(pkg.name, [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'config',
    'login',
    'role',
    'roles',
    'header',
    'alertbar',
    'account',
    'users',
    'teams',
    'schools',
    'leagues'
]);

exports = module.exports = IntelligenceWebClient;

var pkg = require('../package.json');

var IntelligenceWebClient = angular.module(pkg.name, [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'login',
    'role',
    'roles',
    'account',
    'users',
    'teams',
    'schools'
]);

exports = module.exports = IntelligenceWebClient;

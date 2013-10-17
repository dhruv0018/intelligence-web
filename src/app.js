var pkg = require('../package.json');

var IntelligenceWebClient = angular.module(pkg.name, [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'login',
    'roles',
    'account',
    'users',
    'schools'
]);

exports = module.exports = IntelligenceWebClient;
